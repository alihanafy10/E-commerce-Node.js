import { Router } from "express";
import { createOrder } from "./oredr.controller.js";


export const oredrRouter = Router();

oredrRouter.post("/create", createOrder);

