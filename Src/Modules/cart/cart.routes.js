import { Router } from "express";
import { AddToCart, removeForCart, updateCart } from "./cart.controller.js";


export const cartRouter = Router();

cartRouter.post("/add/:productId", AddToCart);
cartRouter.delete("/delete/:productId", removeForCart);
cartRouter.put("/update/:productId", updateCart);


