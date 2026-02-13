import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Brand } from "../entities/Brand";
import { Review } from "../entities/Review";
import { Offer } from "../entities/Offer";
import { Banner } from "../entities/Banner";
import { Notification } from "../entities/Notification";
import bcrypt from "bcryptjs";

export const seedDatabase = async (req: Request, res: Response) => {
    try {
        const categoryRepo = AppDataSource.getRepository(Category);
        const productRepo = AppDataSource.getRepository(Product);
        const userRepo = AppDataSource.getRepository(User);
        const brandRepo = AppDataSource.getRepository(Brand);

        // Create Admin User
        const existingAdmin = await userRepo.findOneBy({ email: "admin@cloude.in" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const admin = userRepo.create({
                name: "Admin User",
                email: "admin@cloude.in",
                password: hashedPassword,
                status: "Active"
            });
            await userRepo.save(admin);
        }

        // Create Sample Customers
        const customerCount = await userRepo.count();
        if (customerCount <= 1) { // Only admin exists
            await userRepo.save([
                userRepo.create({ name: "Rahul Sharma", email: "rahul@example.com", password: await bcrypt.hash("user123", 10), phone: "+91 9876543210", status: "Active", orders: 5, spent: 4500 }),
                userRepo.create({ name: "Anjali Gupta", email: "anjali@example.com", password: await bcrypt.hash("user123", 10), phone: "+91 8888888888", status: "Active", orders: 12, spent: 15600 }),
                userRepo.create({ name: "Vikram Singh", email: "vikram@example.com", password: await bcrypt.hash("user123", 10), phone: "+91 7777777777", status: "Blocked", orders: 1, spent: 200 })
            ]);
        }

        // Create Sample Brands
        const brands = ["Samsung", "Apple", "Nike", "Nestle"];
        for (const brand of brands) {
            const existing = await brandRepo.findOneBy({ name: brand });
            if (!existing) {
                await brandRepo.save(brandRepo.create({ name: brand }));
            }
        }

        // Create Sample Categories
        const categories = ["Electronics", "Fashion", "Home & Garden", "Groceries"];
        for (const catName of categories) {
            const existing = await categoryRepo.findOneBy({ title: catName });
            if (!existing) {
                await categoryRepo.save(categoryRepo.create({ title: catName }));
            }
        }

        // Create Sample Products
        const electronics = await categoryRepo.findOneBy({ title: "Electronics" });
        if (electronics) {
            const productCount = await productRepo.count();
            if (productCount === 0) {
                await productRepo.save([
                    productRepo.create({
                        name: "iPhone 15 Pro",
                        description: "Latest Apple Phone",
                        price: 129999,
                        stock: 50,
                        category: electronics,
                        type: "Tech",
                        mrp: 134999,
                        unit: "pcs"
                    }),
                    productRepo.create({
                        name: "MacBook Air M2",
                        description: "Slim and Powerful",
                        price: 99000,
                        stock: 20,
                        category: electronics,
                        type: "Tech",
                        mrp: 114999,
                        unit: "pcs"
                    })
                ]);
            }
        }

        // Create Sample Reviews
        const reviewRepo = AppDataSource.getRepository(Review);
        const reviewCount = await reviewRepo.count();
        if (reviewCount === 0) {
            await reviewRepo.save([
                reviewRepo.create({ user: "Amit S.", product: "iPhone 15 Pro", rating: 5, comment: "Amazing display! Absolutely worth the price.", status: "Approved" }),
                reviewRepo.create({ user: "Priya K.", product: "MacBook Air M2", rating: 4, comment: "Very fast, but the keyboard feels a bit shallow.", status: "Pending" }),
                reviewRepo.create({ user: "Karan J.", product: "iPhone 15 Pro", rating: 2, comment: "Battery life is not as good as advertised.", status: "Pending" })
            ]);
        }

        // Create Sample Offers
        const offerRepo = AppDataSource.getRepository(Offer);
        const offerCount = await offerRepo.count();
        if (offerCount === 0) {
            await offerRepo.save([
                offerRepo.create({ title: "Welcome Discount", description: "Get 10% off on your first order", code: "WELCOME10", discount: 10, type: "percentage" }),
                offerRepo.create({ title: "Summer Sale", description: "Flat ₹500 off", code: "SUMMER500", discount: 500, type: "fixed" })
            ]);
        }

        // Create Sample Banners
        const bannerRepo = AppDataSource.getRepository(Banner);
        const bannerCount = await bannerRepo.count();
        if (bannerCount === 0) {
            await bannerRepo.save([
                bannerRepo.create({ imageUrl: "https://vzvjpfyitfkyrccksaqm.supabase.co/storage/v1/object/public/banners/banner1.jpg", position: "Main Home" }),
                bannerRepo.create({ imageUrl: "https://vzvjpfyitfkyrccksaqm.supabase.co/storage/v1/object/public/banners/banner2.jpg", position: "Electronics Section" })
            ]);
        }

        // Create Sample Notifications
        const notifRepo = AppDataSource.getRepository(Notification);
        const notifCount = await notifRepo.count();
        if (notifCount === 0) {
            await notifRepo.save([
                { title: "New Order Received", message: "Order #ORD123 has been placed by Rahul Sharma.", targetAudience: "Admin" },
                { title: "Low Stock Alert", message: "iPhone 15 Pro is running low (only 5 left).", targetAudience: "Admin" },
                { title: "Support Ticket", message: "New critical ticket from Anjali Gupta.", targetAudience: "Admin" }
            ]);
        }

        return res.json({ message: "Database seeded correctly" });
    } catch (error: any) {
        console.error("Seeding error:", error);
        return res.status(500).json({ message: "Seeding failed", error: error.message });
    }
};
