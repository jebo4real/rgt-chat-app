
import { BlockUser, GetBlockedList, GetChatInteraction } from "../controllers/chat";
import express from "express";

const chatRoute = express.Router()

chatRoute.post("/block-user/:userId", BlockUser);
chatRoute.get("/block-list/:userId", GetBlockedList);
chatRoute.get("/:userId1/:userId2", GetChatInteraction);


export default chatRoute;