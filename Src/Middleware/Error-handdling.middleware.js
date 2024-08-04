import * as utils from "../Utils/index.js";

//catch error in routes
 function catchError(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => {
      next(err);
    });
  };
}

// handle unhandled error
 const unhandledRoutes = (req, res, next) => {
  next(new utils.AppEroor(`route not found ${req.originalUrl}`, 404));
};


//error handler
const errorHandler = (err, req, res, next) => {
  console.log(err);
  let code = err.statusCode || 500;
  res
    .status(code)
    .json({
      error: "error",
      message: err.message,
      code,
      errorDetails: err.errorDetails,
    });
};

export { errorHandler, unhandledRoutes, catchError };