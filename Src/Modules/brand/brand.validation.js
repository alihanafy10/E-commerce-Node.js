import Joi from "joi";
import { generalRules, objectIdRule } from "../../Utils/index.js";

const createBrandSchema = {
  query: Joi.object({
    subCategory_id: Joi.string().custom(objectIdRule).required(),
    category_id: Joi.string().custom(objectIdRule).required(),
  }),
  body: Joi.object({
    name: generalRules.name.required(),
  }),
};

export { createBrandSchema };