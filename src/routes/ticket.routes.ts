import { Router } from "express";
import { TicketController } from "../controllers/TicketController";

const router = Router();
const controller = new TicketController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.post("/:id/reply", (req, res) => controller.reply(req, res));
router.patch("/:id/status", (req, res) => controller.updateStatus(req, res));

export default router;
