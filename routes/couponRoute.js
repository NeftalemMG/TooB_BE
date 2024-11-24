import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js ";
import { getCoupon, validateCoupon } from "../controllers/coupon_controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

export { router };