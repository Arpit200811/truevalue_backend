import { Router } from "express";
import { BrandController } from "../controllers/BrandController";

const BrandRouter = Router();
const controller = new BrandController();

BrandRouter.get("/", (req, res) => controller.getAll(req, res));
BrandRouter.post("/", (req, res) => controller.create(req, res));
BrandRouter.put("/:id", (req, res) => controller.update(req, res));
BrandRouter.delete("/:id", (req, res) => controller.delete(req, res));

export default BrandRouter;
