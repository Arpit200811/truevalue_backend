import { Router } from "express";
import { WalletController } from "../controllers/WalletController";

const router = Router();
const controller = new WalletController();

router.post("/add", (req, res) => controller.addFunds(req, res));
router.post("/deduct", (req, res) => controller.deductFunds(req, res));
router.get("/history/:userId", (req, res) => controller.getHistory(req, res));

export default router;
