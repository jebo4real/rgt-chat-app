"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chat_1 = require("../controllers/chat");
var express_1 = require("express");
var chatRoute = express_1.default.Router();
chatRoute.post("/block-user/:userId", chat_1.BlockUser);
chatRoute.get("/block-list/:userId", chat_1.GetBlockedList);
chatRoute.get("/:userId1/:userId2", chat_1.GetChatInteraction);
exports.default = chatRoute;
