import Joi from "joi";
import { CouponType, objectIdRule } from '../../Utils/index.js'

export const createCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().required(),
    couponType: Joi.string()
      .valid(...Object.values(CouponType))
      .required(),

    couponAmount: Joi.number()
      .when("couponType", {
        is: Joi.string().valid(CouponType.PERCENT),
        then: Joi.number().max(100).required(),
      })
      .min(1)
      .required(),

    from: Joi.date().greater(Date.now()).optional(),
    to: Joi.date().greater(Joi.ref("from")).required(),
    users: Joi.array().items(
      Joi.object({
        userId: Joi.string().custom(objectIdRule).required(),
        maxCount: Joi.number().min(1).required(),
      })
    ),
  }),
    
  query: Joi.object({
    createdBy: Joi.string().custom(objectIdRule).required(),
  }),
};