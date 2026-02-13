import { Router } from "express";
import { RiderController } from "../controllers/RiderController";

const router = Router();
const riderController = new RiderController();

router.get("/", (req, res) => riderController.getAll(req, res));
router.post("/", (req, res) => riderController.create(req, res));
router.put("/:id", (req, res) => riderController.update(req, res));
router.delete("/:id", (req, res) => riderController.delete(req, res));

export default router;
