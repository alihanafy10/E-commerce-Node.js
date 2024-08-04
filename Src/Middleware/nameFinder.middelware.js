
import { AppEroor } from "../Utils/index.js";
import { catchError } from "./index.js";

export const NameExists = (model) => {
    return catchError(async (req, res, next) => {
      const { name } = req.body;
      if (name) {
        const isNameExists = await model.findOne({ name });
        if (isNameExists) {
          console.log(isNameExists);
          return next(new AppEroor("name already exists", 400));
        }
      }
      next();
    });
}


export const checkIdsExists = (model) => {
  return async (req, res, next) => {
    //destruct Ides from query
    const { categoryId, subcategoryId, brandId } = req.query;
    //ids check
    const document = await model.findOne({
      _id: brandId,
      categoryId,
      subcategoryId,
    })
      .populate("categoryId")
      .populate("subcategoryId");
    if (!document) return next(new AppEroor(`${model.modelName} not found`, 404));

    req.document = document;
    next()
  }
}

