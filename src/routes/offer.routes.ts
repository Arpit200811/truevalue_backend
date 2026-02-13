import { Router } from "express";
import { OfferController } from "../controllers/OfferController";

const router = Router();
const controller = new OfferController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
