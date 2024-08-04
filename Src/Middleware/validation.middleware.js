import { AppEroor } from "../Utils/index.js";


const reqKeys = ["body", "headers", "params", "query"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    for (const key of reqKeys) {
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });
      if (validationResult?.error) {
        validationErrors.push(validationResult.error.details);
      }
    }
    validationErrors.length
      ? next(new AppEroor("validationErrors", 400, validationErrors))
      : next();
  };
};
