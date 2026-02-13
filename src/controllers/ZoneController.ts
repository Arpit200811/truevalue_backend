import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { DeliveryZone } from "../entities/DeliveryZone";

export class ZoneController {
    private get repo() { return AppDataSource.getRepository(DeliveryZone); }

    async getAll(req: Request, res: Response) {
        try {
            const zones = await this.repo.find();
            return res.json(zones);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching zones", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const zone = this.repo.create(req.body as object);
            await this.repo.save(zone);
            return res.status(201).json(zone);
        } catch (error) {
            return res.status(500).json({ message: "Error creating zone", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let zone = await this.repo.findOneBy({ id: Number(id) });
            if (!zone) return res.status(404).json({ message: "Zone not found" });

            this.repo.merge(zone, req.body);
            await this.repo.save(zone);
            return res.json(zone);
        } catch (error) {
            return res.status(500).json({ message: "Error updating zone", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.repo.delete(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting zone", error });
        }
    }

    async toggleSurge(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { active, multiplier } = req.body;
            let zone = await this.repo.findOneBy({ id: Number(id) });
            if (!zone) return res.status(404).json({ message: "Zone not found" });

            zone.surge_price_active = active;
            if (multiplier) zone.surge_multiplier = multiplier;

            await this.repo.save(zone);
            return res.json(zone);
        } catch (error) {
            return res.status(500).json({ message: "Error updating surge", error });
        }
    }
}
