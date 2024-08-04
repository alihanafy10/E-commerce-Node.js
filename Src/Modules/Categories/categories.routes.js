import { Router } from "express";
//middleware
import {
  NameExists,
  fileUpload,
  validationMiddleware,
} from "../../Middleware/index.js";
//utils
import { extentions } from "../../Utils/index.js";
//controller
import * as controllers from './categories.controller.js'
//validateion Schema
import * as categorySchema from './categories.validation.js'
//category model
import { Category } from "../../../Database/Model/index.js";


export const categoryRouter = Router();

categoryRouter.post(
  "/create",
  fileUpload(extentions.Images).single("image"),
  validationMiddleware(categorySchema.createCategorySchema),
  NameExists(Category),
  controllers.createCategory
);

categoryRouter.get('/',validationMiddleware(categorySchema.getCategorySchema), controllers.getCategory)

categoryRouter.put(
  "/update/:_id",
  fileUpload(extentions.Images).single("image"),
  validationMiddleware(categorySchema.updateCtaegorySchema),
  NameExists(Category),
  controllers.updateCategory
);

categoryRouter.delete(
  "/delete/:_id",
  validationMiddleware(categorySchema.deleteCtaegorySchema),
  controllers.deleteCategory
);

