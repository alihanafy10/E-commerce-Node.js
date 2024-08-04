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
import * as controllers from "./brand.controller.js";
//validation schema
import * as subCategorySchema from "./brand.validation.js";
//sub-ctaegory model
import { Brand } from "../../../Database/Model/index.js";

import { deleteCtaegorySchema, getCategorySchema } from "../Categories/categories.validation.js";
import { updateSubCtaegorySchema } from "../sub-category/sub-category.validation.js";


export const brandRouter = Router();

brandRouter.post(
  "/create",
    fileUpload(extentions.Images).single("logo"),
  validationMiddleware(subCategorySchema.createBrandSchema),
  controllers.createBrand
);


brandRouter.get(
  "/",
  validationMiddleware(getCategorySchema),
  controllers.getBrand
);


brandRouter.put(
  "/update/:_id",
  fileUpload(extentions.Images).single("logo"),
  validationMiddleware(updateSubCtaegorySchema),
  controllers.updateBrand
);

brandRouter.delete(
  "/delete/:_id",
  validationMiddleware(deleteCtaegorySchema),
  controllers.deleteBrand
);
