import Joi from "joi";
import { generalRules, objectIdRule } from "../../Utils/index.js";

const createSubCategorySchema = {
  body: Joi.object({
    name: generalRules.name.required(),
    //todo _id of brodauct
  }),
  query: Joi.object({
    categoryId: Joi.string().custom(objectIdRule).required(),
  }),
};

const updateSubCtaegorySchema = {
  body: Joi.object({
    name: generalRules.name.optional(),
  }),
  params: Joi.object({
    _id: Joi.string().custom(objectIdRule).required(),
  }),
};


export { createSubCategorySchema, updateSubCtaegorySchema };