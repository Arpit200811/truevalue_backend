import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Rider } from "../entities/Rider";

export class RiderController {
    private get riderRepository() { return AppDataSource.getRepository(Rider); }

    async getAll(req: Request, res: Response) {
        try {
            const riders = await this.riderRepository.find({ order: { joinedAt: "DESC" } });
            return res.json(riders);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching riders", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const newRider = this.riderRepository.create(req.body);
            await this.riderRepository.save(newRider);
            return res.status(201).json(newRider);
        } catch (error) {
            return res.status(500).json({ message: "Error adding rider", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const rider = await this.riderRepository.findOneBy({ id: req.params.id as string });
            if (!rider) return res.status(404).json({ message: "Rider not found" });

            this.riderRepository.merge(rider, req.body);
            await this.riderRepository.save(rider);
            return res.json(rider);
        } catch (error) {
            return res.status(500).json({ message: "Error updating rider", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const results = await this.riderRepository.delete(req.params.id);
            if (results.affected === 0) return res.status(404).json({ message: "Rider not found" });
            return res.json({ message: "Rider deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting rider", error });
        }
    }
}
