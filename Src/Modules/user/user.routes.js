import { Router } from "express";
import { registration, updateAcc } from "./user.controller.js";

export const userRouter = Router() 

userRouter.post("/register", registration);
userRouter.put("/update/:id", updateAcc);

