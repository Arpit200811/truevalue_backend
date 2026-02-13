import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";

export class ProductController {
    private get productRepository() { return AppDataSource.getRepository(Product); }
    private get categoryRepository() { return AppDataSource.getRepository(Category); }

    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const search = req.query.search as string;
            const categoryId = req.query.categoryId as string;
            const status = req.query.status as string;

            const queryBuilder = this.productRepository.createQueryBuilder("product")
                .leftJoinAndSelect("product.category", "category")
                .orderBy("product.id", "DESC")
                .skip((page - 1) * limit)
                .take(limit);

            if (search) {
                queryBuilder.andWhere("product.name ILIKE :search", { search: `%${search}%` });
            }

            if (categoryId) {
                queryBuilder.andWhere("category.id = :categoryId", { categoryId });
            }

            if (status) {
                if (status === "Active") {
                    queryBuilder.andWhere("product.stock > 0");
                } else if (status === "Out of Stock") {
                    queryBuilder.andWhere("product.stock = 0");
                }
            }

            const [products, total] = await queryBuilder.getManyAndCount();

            return res.json({
                data: products,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching products", error });
        }
    }

    async bulkDelete(req: Request, res: Response) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs format" });

            await this.productRepository.delete(ids);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error in bulk delete", error });
        }
    }

    async bulkUpdateStatus(req: Request, res: Response) {
        try {
            const { ids, isActive } = req.body;
            if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs format" });

            await this.productRepository.update(ids, { isActive });
            return res.json({ message: "Bulk update successful" });
        } catch (error) {
            return res.status(500).json({ message: "Error in bulk update", error });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: parseInt(req.params.id as string) },
                relations: ["category"]
            });
            if (!product) return res.status(404).json({ message: "Product not found" });
            return res.json(product);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching product", error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {
                name, price, stock, categoryId
            } = req.body;

            // Simple Backend Validation
            if (!name || name.length < 3) return res.status(400).json({ message: "Name must be at least 3 characters" });
            if (price === undefined || price < 0) return res.status(400).json({ message: "Price must be positive" });
            if (stock === undefined || stock < 0) return res.status(400).json({ message: "Stock cannot be negative" });
            if (!categoryId) return res.status(400).json({ message: "Category is required" });

            const category = await this.categoryRepository.findOneBy({ id: categoryId });
            if (!category) return res.status(404).json({ message: "Category not found" });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...productData } = req.body;

            const product = new Product();
            Object.assign(product, productData);
            product.category = category;

            await this.productRepository.save(product);
            return res.status(201).json(product);
        } catch (error) {
            console.error("Error creating product:", error);
            return res.status(500).json({ message: "Error creating product", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const fields = req.body;
            let product = await this.productRepository.findOneBy({ id: parseInt(req.params.id as string) });

            if (!product) return res.status(404).json({ message: "Product not found" });

            if (fields.categoryId) {
                const category = await this.categoryRepository.findOneBy({ id: fields.categoryId });
                if (category) product.category = category;
            }

            // Sync all fields dynamically
            Object.assign(product, fields);

            await this.productRepository.save(product);
            return res.json(product);
        } catch (error) {
            return res.status(500).json({ message: "Error updating product", error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await this.productRepository.delete(req.params.id);
            if (result.affected === 0) return res.status(404).json({ message: "Product not found" });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Error deleting product", error });
        }
    }
}
