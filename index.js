//handle errors in code
process.on("uncaughtException", (error) => {
  console.log("error in code", error);
});

import express from "express";
import { config } from "dotenv";

import db_connection from "./Database/Connection.js";
import * as middlewares from "./Src/Middleware/index.js";
import { brandRouter, categoryRouter, productRoutes, subCategoryRouter, userRouter } from "./Src/Modules/index.js";



config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/category",categoryRouter);
app.use("/sub-category", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRoutes);
app.use("/user", userRouter);


db_connection();

// handeling unhandled routes
app.use("*",middlewares.unhandledRoutes);

 //error handler
app.use(middlewares.errorHandler);

// handle error outside express
process.on('unhandledRejection', (error) => {
    console.log('error',error);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
