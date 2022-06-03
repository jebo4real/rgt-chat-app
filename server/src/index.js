"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var http = require("http");
var socketio = require("socket.io");
var redis_adapter_1 = require("@socket.io/redis-adapter");
var redis_1 = require("redis");
var path_1 = require("path");
var chat_1 = require("./controllers/chat");
// routes
var user_1 = require("./routes/user");
var chat_2 = require("./routes/chat");
var db = require("./config/connection");
var app = (0, express_1.default)();
// Express configuration
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/user", user_1.default);
app.use("/api/chat", chat_2.default);
// serve static frontend content (for heroku deployment of all services as one)
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/build/")));
app.get("*", function (_, res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
// health check
app.get("/", function (_req, res) {
    res.send("healthy");
});
var server = http.createServer(app);
var io = new socketio.Server(server, { allowEIO3: true });
var pubClient = (0, redis_1.createClient)({ url: "redis://redis-15424.c268.eu-west-1-2.ec2.cloud.redislabs.com" });
var subClient = pubClient.duplicate();
io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
var port = process.env.PORT || 3001;
// temporarily store online users
var onlineUsers = [];
io.on("connection", function (socket) {
    //announcing user online
    //if user id exists, update socket id
    socket.on('login', function (_a) {
        var userName = _a.userName, userId = _a.userId;
        // saving userId to object with socket ID
        if (![null, undefined, ""].includes(userName)) {
            if (!onlineUsers.find(function (item) { return item.userName === userName; })) {
                onlineUsers.push({ userName: userName, socketId: socket.id, userId: userId });
            }
        }
        io.emit("user-online", onlineUsers);
    });
    // receive message
    socket.on("chat-message", function (_a) {
        var senderId = _a.senderId, receiverId = _a.receiverId, message = _a.message;
        return __awaiter(void 0, void 0, void 0, function () {
            var newMessage, savedMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log(senderId, message);
                        newMessage = {
                            senderId: senderId,
                            receiverId: receiverId,
                            message: message
                        };
                        return [4 /*yield*/, (0, chat_1.SaveChat)(newMessage)
                            // emit messages both to receiver and sender(ack)
                        ];
                    case 1:
                        savedMessage = _b.sent();
                        // emit messages both to receiver and sender(ack)
                        io.emit("chat-message-".concat(receiverId), savedMessage);
                        io.emit("chat-message-".concat(senderId), savedMessage);
                        return [2 /*return*/];
                }
            });
        });
    });
    // remove user from online when disconnected
    socket.on("disconnect", function () {
        console.log("disonnected");
        var newOnlineUsers = onlineUsers.filter(function (item) { return item.socketId != socket.id; });
        onlineUsers = newOnlineUsers;
        io.emit("user-online", newOnlineUsers);
    });
});
db.once("open", function () {
    console.log("mongodb connected");
    server.listen(port, function () { return console.log("Server started on port ".concat(port)); });
});
