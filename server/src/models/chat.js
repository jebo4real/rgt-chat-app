"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    senderId: {
        type: String,
        required: true,
        trim: true
    },
    receiverId: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
var Chat = mongoose_1.default.model("Chat", userSchema);
exports.default = Chat;
