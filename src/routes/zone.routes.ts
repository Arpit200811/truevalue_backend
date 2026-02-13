import { Router } from "express";
import { ZoneController } from "../controllers/ZoneController";

const router = Router();
const controller = new ZoneController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/:id/surge", (req, res) => controller.toggleSurge(req, res));

export default router;
