import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Brand } from "../entities/Brand";

export class BrandController {
    private get brandRepository() { return AppDataSource.getRepository(Brand); }

    async getAll(req: Request, res: Response) {
        try {
            const brands = await this.brandRepository.find();
            return res.json(brands);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching brands", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { id, ...brandData } = req.body;
            const brand = this.brandRepository.create(brandData as object);
            await this.brandRepository.save(brand);
            return res.status(201).json(brand);
        } catch (error) {
            console.error("Error creating brand:", error);
            return res.status(500).json({ message: "Error creating brand", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let brand = await this.brandRepository.findOneBy({ id: parseInt(id as string) });
            if (!brand) return res.status(404).json({ message: "Brand not found" });

            Object.assign(brand, req.body);
            await this.brandRepository.save(brand);
            return res.json(brand);
        } catch (error) {
            return res.status(500).json({ message: "Error updating brand", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await this.brandRepository.delete(req.params.id);
            if (result.affected === 0) return res.status(404).json({ message: "Brand not found" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting brand", error });
        }
    }
}
