import Joi from "joi";
import { Types } from "mongoose";

export const generalRules = {
  name: Joi.string()
    .min(3)
    .max(20)
    .trim(true)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base":
        "The name must contain uppercase or lowercase letters or spaces.",
    }),
};

export function objectIdRule(value, helper) {
  const isValidObjectId = Types.ObjectId.isValid(value);
  return isValidObjectId ? value : helper.messages("invalidObjectId");
}
