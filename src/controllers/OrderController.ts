import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { EmailService } from "../services/EmailService";
import { PushNotificationService } from "../services/PushNotificationService";

export class OrderController {
    private get orderRepository() { return AppDataSource.getRepository(Order); }
    private get productRepository() { return AppDataSource.getRepository(Product); }
    private get userRepository() { return AppDataSource.getRepository(User); }

    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const status = req.query.status as string;
            const paymentMethod = req.query.paymentMethod as string;

            const queryBuilder = this.orderRepository.createQueryBuilder("order")
                .leftJoinAndSelect("order.user", "user")
                .leftJoinAndSelect("order.items", "items")
                .leftJoinAndSelect("items.product", "product")
                .orderBy("order.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit);

            if (status) queryBuilder.andWhere("order.status = :status", { status });
            if (paymentMethod) queryBuilder.andWhere("order.paymentMethod = :paymentMethod", { paymentMethod });

            const [orders, total] = await queryBuilder.getManyAndCount();

            return res.json({
                data: orders,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching orders", error });
        }
    }

    async bulkUpdateStatus(req: Request, res: Response) {
        try {
            const { ids, status } = req.body;
            if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs format" });
            if (!Object.values(OrderStatus).includes(status)) return res.status(400).json({ message: "Invalid status" });

            await this.orderRepository.update(ids, { status });

            // Broadcast update for each order
            const msg = `Bulk Status Update triggered for ${ids.length} orders. Target status: ${status}`;
            await PushNotificationService.broadcastToAll("Orders Batch Update", msg);

            return res.json({ message: `Bulk status update to ${status} successful for ${ids.length} orders.` });
        } catch (error) {
            return res.status(500).json({ message: "Error in bulk order update", error });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const order = await this.orderRepository.findOne({
                where: { id: req.params.id as string },
                relations: ["user", "items", "items.product"]
            });
            if (!order) return res.status(404).json({ message: "Order not found" });
            return res.json(order);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching order", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { userId, items, address, paymentMethod } = req.body;

            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ message: "User not found" });

            const order = new Order();
            order.user = user;
            order.address = address;
            order.paymentMethod = paymentMethod;
            order.total = 0;
            order.items = [];

            const lowStockAlerts: string[] = [];

            for (const item of items) {
                const product = await this.productRepository.findOneBy({ id: item.productId });
                if (!product) continue;

                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                }

                product.stock -= item.quantity;
                await this.productRepository.save(product);

                if (product.stock < 10) {
                    lowStockAlerts.push(`${product.name} (Remaining: ${product.stock})`);
                }

                const orderItem = new OrderItem();
                orderItem.product = product;
                orderItem.quantity = item.quantity;
                orderItem.price = product.price;
                order.total += Number(product.price) * item.quantity;
                order.items.push(orderItem);
                // eslint-disable-next-line no-empty
            }

            await this.orderRepository.save(order);

            // Notify Admin
            if (Number(order.total) > 5000) {
                await EmailService.sendAdminAlert("High Value Order Received", `Order #${order.id} for ₹${order.total} placed.`);
            }

            // Low Stock Alert
            if (lowStockAlerts.length > 0) {
                await EmailService.sendAdminAlert("Low Stock Alert ⚠️", `The following items are running low:\n\n${lowStockAlerts.join('\n')}`);
            }

            // Push Notification
            await PushNotificationService.broadcastToAll("New Order Placed", `Order worth ₹${order.total} is being processed.`);

            return res.status(201).json(order);
        } catch (error) {
            return res.status(500).json({ message: "Error creating order", error });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            let order = await this.orderRepository.findOneBy({ id: req.params.id as string });
            if (!order) return res.status(404).json({ message: "Order not found" });

            if (Object.values(OrderStatus).includes(status)) {
                order.status = status;
                await this.orderRepository.save(order);

                const msg = `Order #${order.id?.substring(0, 8)} status updated to: ${status}`;
                await PushNotificationService.broadcastToAll("Order Update", msg);

                if (status === "Delivered") {
                    await EmailService.sendEmail("user@example.com", "Order Delivered!", `Your order #${order.id} has been delivered.`);
                }

                return res.json(order);
            } else {
                return res.status(400).json({ message: "Invalid status" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error updating order status", error });
        }
    }
}
