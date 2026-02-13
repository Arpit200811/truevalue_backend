import { Router } from "express";
import { SettingController } from "../controllers/SettingController";

const router = Router();
const controller = new SettingController();

router.get("/", (req, res) => controller.getSettings(req, res));
router.post("/", (req, res) => controller.updateSettings(req, res));

export default router;
