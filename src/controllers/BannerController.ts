import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Banner } from "../entities/Banner";

export class BannerController {
    private get repo() { return AppDataSource.getRepository(Banner); }

    async getAll(req: Request, res: Response) {
        try {
            return res.json(await this.repo.find());
        } catch (error) {
            return res.status(500).json({ message: "Error fetching banners", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const banner = this.repo.create(req.body as object);
            await this.repo.save(banner);
            return res.status(201).json(banner);
        } catch (error) {
            return res.status(500).json({ message: "Error creating banner", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting banner", error });
        }
    }
}
