"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        trim: true
    }
});
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
