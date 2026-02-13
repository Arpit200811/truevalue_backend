import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { Rider } from "../entities/Rider";

export const getStats = async (req: Request, res: Response) => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const productRepo = AppDataSource.getRepository(Product);
        const userRepo = AppDataSource.getRepository(User);
        const catRepo = AppDataSource.getRepository(Category);
        const riderRepo = AppDataSource.getRepository(Rider);

        const totalOrders = await orderRepo.count();
        const totalProducts = await productRepo.count();
        const totalCustomers = await userRepo.count();

        const totalRiders = await riderRepo.count();
        const activeRiders = await riderRepo.count({ where: { availability: "Online" } });

        const orders = await orderRepo.find({ relations: ["items", "items.product", "items.product.category"] });
        const totalRevenue = orders
            .filter(o => o.status === "Delivered")
            .reduce((acc, curr) => acc + Number(curr.total), 0);

        // Calculate Revenue Trend (Last 7 days)
        const salesTrend: any[] = [];
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        last7Days.forEach(date => {
            const dayRevenue = orders
                .filter(o => o.createdAt.toISOString().split('T')[0] === date && o.status === "Delivered")
                .reduce((acc, curr) => acc + Number(curr.total), 0);
            salesTrend.push({ date: date.split('-').slice(1).reverse().join('/'), revenue: dayRevenue });
        });

        // Category Share
        const categoryStats: any = {};
        orders.forEach(o => {
            o.items?.forEach(item => {
                const catName = item.product?.category?.title || "Other";
                categoryStats[catName] = (categoryStats[catName] || 0) + 1;
            });
        });

        const COLORS = ["#16a34a", "#3b82f6", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4"];
        const categoryDistribution = Object.keys(categoryStats).map((name, i) => ({
            name,
            value: categoryStats[name],
            color: COLORS[i % COLORS.length]
        }));

        return res.json({
            totalOrders,
            totalProducts,
            totalCustomers,
            totalRevenue,
            activeUsers: Math.floor(Math.random() * 500) + 1000,
            activeRiders,
            totalRiders,
            salesTrend,
            categoryDistribution
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};
