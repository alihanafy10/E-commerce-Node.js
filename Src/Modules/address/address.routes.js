import { Router } from "express";
import { createAddress, deleteAddress, updateAddress } from "./address.controller.js";


export const addressRouter = Router();

addressRouter.post("/create", createAddress);
addressRouter.put("/update/:_id", updateAddress);
addressRouter.delete("/delete/:_id", deleteAddress);


