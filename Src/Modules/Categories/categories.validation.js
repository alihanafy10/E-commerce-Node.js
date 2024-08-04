import Joi from "joi";
import { generalRules, objectIdRule } from "../../Utils/index.js";


const createCategorySchema = {
  body: Joi.object({
    name: generalRules.name.required(),
    //todo _id of brodauct
  }),
};

const getCategorySchema = {
  query: Joi.object({
    name: generalRules.name.optional(),
    _id: Joi.string().custom(objectIdRule).optional(),
    slug: Joi.string()
      .pattern(/^[a-z-]+$/)
      .optional()
      .messages({ "string.pattern.base": "enter valid slug" }),
  }),
};

const updateCtaegorySchema = {
  body: Joi.object({
    name: generalRules.name.optional(),
  }),
  params: Joi.object({
    _id: Joi.string().custom(objectIdRule).required(),
  }),
};

const deleteCtaegorySchema = {
  params: Joi.object({
    _id: Joi.string().custom(objectIdRule).required(),
  }),
};




export {
  createCategorySchema,
  updateCtaegorySchema,
  getCategorySchema,
  deleteCtaegorySchema,
};
