import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController";

const router = Router();
const controller = new ReviewController();

router.get("/", (req, res) => controller.getAll(req, res));
router.patch("/:id/status", (req, res) => controller.updateStatus(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
