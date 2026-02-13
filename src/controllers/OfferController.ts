import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Offer } from "../entities/Offer";

export class OfferController {
    private get repo() { return AppDataSource.getRepository(Offer); }

    async getAll(req: Request, res: Response) {
        try {
            return res.json(await this.repo.find());
        } catch (error) {
            return res.status(500).json({ message: "Error fetching offers", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const offer = this.repo.create(req.body as object);
            await this.repo.save(offer);
            return res.status(201).json(offer);
        } catch (error) {
            return res.status(500).json({ message: "Error creating offer", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting offer", error });
        }
    }
}
