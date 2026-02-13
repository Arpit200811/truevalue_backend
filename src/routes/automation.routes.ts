import { Router } from "express";
import { AutomationController } from "../controllers/AutomationController";

const router = Router();
const controller = new AutomationController();

router.get("/abandoned-carts", (req, res) => controller.getAbandonedCarts(req, res));
router.post("/trigger-recovery", (req, res) => controller.triggerRecovery(req, res));
router.get("/stats", (req, res) => controller.getStats(req, res));

export default router;
