import { Router } from "express";
import { CouponController } from "../controllers/CouponController";

const router = Router();
const controller = new CouponController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/validate", (req, res) => controller.validate(req, res));

export default router;
