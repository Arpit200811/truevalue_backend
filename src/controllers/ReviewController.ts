import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Review } from "../entities/Review";

export class ReviewController {
    private get repo() { return AppDataSource.getRepository(Review); }

    async getAll(req: Request, res: Response) {
        try {
            const reviews = await this.repo.find({ order: { createdAt: "DESC" } as any });
            return res.json(reviews);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching reviews", error });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { status } = req.body;
            let review = await this.repo.findOneBy({ id: parseInt(id as string) });
            if (!review) return res.status(404).json({ message: "Review not found" });
            review.status = status;
            await this.repo.save(review);
            return res.json(review);
        } catch (error: any) {
            return res.status(500).json({ message: "Error updating review", error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id as string);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ message: "Error deleting review", error: error.message });
        }
    }
}
