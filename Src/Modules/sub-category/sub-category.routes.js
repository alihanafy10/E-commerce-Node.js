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
import * as controllers from "./sub-category.controller.js";
//validation schema
import * as subCategorySchema from "./sub-category.validation.js";
//sub-ctaegory model
import { Subcategory } from "../../../Database/Model/index.js";

import { deleteCtaegorySchema, getCategorySchema } from "../Categories/categories.validation.js";

export const subCategoryRouter = Router();

subCategoryRouter.post(
  "/create",
  fileUpload(extentions.Images).single("image"),
  validationMiddleware(subCategorySchema.createSubCategorySchema),
  NameExists(Subcategory),
  controllers.createSubCategory
);


subCategoryRouter.get(
  "/",
  validationMiddleware(getCategorySchema),
  controllers.getSubCategory
);

subCategoryRouter.put(
  "/update/:_id",
  fileUpload(extentions.Images).single("image"),
  validationMiddleware(subCategorySchema.updateSubCtaegorySchema),
  NameExists(Subcategory),
  controllers.updateSubCategory
);

subCategoryRouter.delete(
  "/delete/:_id",
  validationMiddleware(deleteCtaegorySchema),
  controllers.deleteSubCategory
);