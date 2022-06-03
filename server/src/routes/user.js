"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../controllers/user");
var express_1 = require("express");
var userRoute = express_1.default.Router();
userRoute.post("/", user_1.SaveUser);
userRoute.get("/all", user_1.GetAllUsers);
exports.default = userRoute;
