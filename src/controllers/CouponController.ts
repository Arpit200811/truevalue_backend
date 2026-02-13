import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Coupon } from "../entities/Coupon";

export class CouponController {
    private get repo() { return AppDataSource.getRepository(Coupon); }

    async getAll(req: Request, res: Response) {
        try {
            const coupons = await this.repo.find({ order: { createdAt: "DESC" } });
            return res.json(coupons);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching coupons", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const coupon = this.repo.create(req.body as object);
            await this.repo.save(coupon);
            return res.status(201).json(coupon);
        } catch (error) {
            return res.status(500).json({ message: "Error creating coupon", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting coupon", error });
        }
    }

    async validate(req: Request, res: Response) {
        try {
            const { code, amount } = req.body;
            const coupon = await this.repo.findOneBy({ code });

            if (!coupon) return res.status(404).json({ message: "Invalid Coupon" });
            if (!coupon.isActive) return res.status(400).json({ message: "Coupon Expired" });
            if (coupon.min_order_value > amount) return res.status(400).json({ message: `Min order value is ₹${coupon.min_order_value}` });
            if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) return res.status(400).json({ message: "Coupon Expired" });

            let discount = 0;
            if (coupon.type.toLowerCase() === "percentage") {
                discount = (amount * coupon.value) / 100;
                if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount;
            } else {
                discount = coupon.value;
            }

            return res.json({ discount, finalAmount: amount - discount });
        } catch (error) {
            return res.status(500).json({ message: "Error validating coupon", error });
        }
    }
}
