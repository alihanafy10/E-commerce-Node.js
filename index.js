//handle errors in code
process.on("uncaughtException", (error) => {
  console.log("error in code", error);
});

import express from "express";
import { config } from "dotenv";

import db_connection from "./Database/Connection.js";
import * as middlewares from "./Src/Middleware/index.js";
import { addressRouter, brandRouter, cartRouter, categoryRouter, couponRouter, oredrRouter, productRoutes, subCategoryRouter, userRouter } from "./Src/Modules/index.js";
import { cronsJobOne } from "./Src/Utils/crons.utils.js";
import { gracefulShutdown } from "node-schedule";





config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/category",categoryRouter);
app.use("/sub-category", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRoutes);
app.use("/user", userRouter);
app.use("/address", addressRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);
app.use("/order", oredrRouter);


db_connection();

cronsJobOne();
gracefulShutdown();

// handeling unhandled routes
app.use("*",middlewares.unhandledRoutes);

 //error handler
app.use(middlewares.errorHandler);

// handle error outside express
process.on('unhandledRejection', (error) => {
    console.log('error',error);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
