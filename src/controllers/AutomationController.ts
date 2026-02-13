import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Notification } from "../entities/Notification";
import { LessThan } from "typeorm";

export class AutomationController {
    private get cartRepo() { return AppDataSource.getRepository(Cart); }
    private get notifRepo() { return AppDataSource.getRepository(Notification); }

    async getAbandonedCarts(req: Request, res: Response) {
        try {
            // Carts not updated for 1 hour and still 'active' are considered abandoned
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const carts = await this.cartRepo.find({
                where: {
                    status: "active",
                    updatedAt: LessThan(oneHourAgo)
                },
                relations: ["user", "items", "items.product"]
            });
            return res.json(carts);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching abandoned carts", error });
        }
    }

    async triggerRecovery(req: Request, res: Response) {
        try {
            const { cartId } = req.body;
            const cart = await this.cartRepo.findOne({
                where: { id: cartId },
                relations: ["user"]
            });

            if (!cart) return res.status(404).json({ message: "Cart not found" });

            // Send Notification (Marketing Automation)
            const notif = this.notifRepo.create({
                title: "🛒 Items waiting in your cart!",
                message: `Hi ${cart.user.name}, you left some items in your cart. Complete your order now and get free delivery!`,
                actionLink: "/cart",
                status: "Urgent",
                reach: "Targeted"
            });
            await this.notifRepo.save(notif);

            // Mark as 'abandoned' (meaning we've sent recovery)
            cart.status = "abandoned";
            await this.cartRepo.save(cart);

            return res.json({ message: "Recovery notification sent successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error during recovery", error });
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const totalCarts = await this.cartRepo.count();
            const abandoned = await this.cartRepo.count({ where: { status: "abandoned" } });
            const active = await this.cartRepo.count({ where: { status: "active" } });

            return res.json({
                totalCarts,
                abandonedCount: abandoned,
                activeCount: active,
                recoveryRate: totalCarts > 0 ? (abandoned / totalCarts) * 100 : 0
            });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching automation stats", error });
        }
    }
}
