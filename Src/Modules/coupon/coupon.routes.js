import { Router } from "express";
import { createCoupon, enableCoupon, getAllCoupons, getCoupon, updateCoupon } from "./coupon.controller.js";
import { validationMiddleware } from "../../Middleware/index.js";
import { createCouponSchema } from "./coupon.validation.js";


export const couponRouter = Router();

couponRouter.post(
  "/create",
  validationMiddleware(createCouponSchema),
  createCoupon
);
couponRouter.get("/", getAllCoupons);
couponRouter.get("/:_id", getCoupon);
couponRouter.put("/update/:_id", updateCoupon);
couponRouter.patch("/update/:_id", enableCoupon);
