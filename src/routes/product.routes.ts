import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = Router();
const controller = new ProductController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getOne(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.post("/bulk-delete", (req, res) => controller.bulkDelete(req, res));
router.post("/bulk-status", (req, res) => controller.bulkUpdateStatus(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
