import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";

const router = Router();
const controller = new NotificationController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));

export default router;
