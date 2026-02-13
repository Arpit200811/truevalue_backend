import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router();
const controller = new OrderController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getOne(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.post("/bulk-status", (req, res) => controller.bulkUpdateStatus(req, res));
router.patch("/:id/status", (req, res) => controller.updateStatus(req, res));

export default router;
