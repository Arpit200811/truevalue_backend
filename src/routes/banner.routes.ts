import { Router } from "express";
import { BannerController } from "../controllers/BannerController";

const router = Router();
const controller = new BannerController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
