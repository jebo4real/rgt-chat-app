"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    list: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
});
var BlockList = mongoose_1.default.model("BlockList", userSchema);
exports.default = BlockList;
