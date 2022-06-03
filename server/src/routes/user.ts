
import { SaveUser, GetAllUsers } from "../controllers/user";
import express from "express";

const userRoute = express.Router()

userRoute.post("/", SaveUser);
userRoute.get("/all", GetAllUsers);

export default userRoute;