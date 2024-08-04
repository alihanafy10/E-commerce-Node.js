import { Router } from "express";

//middleware
import {
  checkIdsExists,
  fileUpload,
  validationMiddleware,
} from "../../Middleware/index.js";
//utils
import { extentions } from "../../Utils/index.js";
//controller
import * as controllers from "./product.controller.js";
import { Brand } from "../../../Database/Model/index.js";

export const productRoutes = Router()

productRoutes.post(
  "/create",
    fileUpload(extentions.Images).array("images", 5),
  checkIdsExists(Brand),
  controllers.createProduct
);


productRoutes.put('/update/:_id',controllers.updateProduct)

productRoutes.get("/list", controllers.listProducts);