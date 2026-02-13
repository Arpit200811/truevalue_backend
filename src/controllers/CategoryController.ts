import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";

export class CategoryController {
    private get categoryRepository() { return AppDataSource.getRepository(Category); }

    async getAll(req: Request, res: Response) {
        try {
            const categories = await this.categoryRepository.find({
                relations: ["parent"]
            });
            return res.json(categories);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching categories", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { title, image, parentId } = req.body;

            const category = new Category();
            category.title = title;
            category.image = image;

            if (parentId) {
                const parent = await this.categoryRepository.findOneBy({ id: parseInt(parentId) });
                if (parent) category.parent = parent;
            }

            await this.categoryRepository.save(category);
            return res.status(201).json(category);
        } catch (error) {
            return res.status(500).json({ message: "Error creating category", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { title, image, parentId } = req.body;
            let category = await this.categoryRepository.findOne({ where: { id: parseInt(req.params.id as string) }, relations: ['parent'] });
            if (!category) return res.status(404).json({ message: "Category not found" });

            if (title !== undefined) category.title = title;
            if (image !== undefined) category.image = image;

            if (parentId !== undefined) {
                if (parentId) {
                    const parent = await this.categoryRepository.findOneBy({ id: parseInt(parentId) });
                    if (parent) category.parent = parent;
                } else {
                    category.parent = undefined; // Remove parent
                }
            }

            await this.categoryRepository.save(category);
            return res.json(category);
        } catch (error) {
            return res.status(500).json({ message: "Error updating category", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await this.categoryRepository.delete(req.params.id);
            if (result.affected === 0) return res.status(404).json({ message: "Category not found" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting category", error });
        }
    }
}
