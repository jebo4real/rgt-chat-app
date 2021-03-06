require("dotenv").config();
import bodyParser from "body-parser";
import express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import path from "path";

import { SaveChat } from "./controllers/chat";
// routes
import userRoute from "./routes/user";
import chatRoute from "./routes/chat";


const db = require("./config/connection");

const app = express();

// Express configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute)

// serve static frontend content (for heroku deployment of all services as one)
app.use(express.static(path.join(__dirname, "../../client/build/")));

app.get("*", (_, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// health check
app.get("/", (_req, res) => {
  res.send("healthy");
});


const server = http.createServer(app);

// create socket instance
const io = new socketio.Server(server, {allowEIO3: true});

// add a redis client(pub and sub)
const pubClient = createClient({ url:`${process.env.REDISURL}`, legacyMode: true });
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  console.log(err);
});

// use the redis client as adapters
io.adapter(createAdapter(pubClient, subClient));

const port = process.env.PORT || 3001;

// temporarily store online users
let onlineUsers : any = []

io.on("connection", (socket) => {

  //announcing user online
  //if user id exists, update socket id
  socket.on('login', function({userName, userId}){

    // saving userId to object with socket ID
    if(![null, undefined, ""].includes(userName)) {
      if(!onlineUsers.find((item:any )=> item.userName === userName)){
        onlineUsers.push({userName, socketId: socket.id, userId})
      }
    }
    io.emit("user-online", onlineUsers)

  });

  // receive message
  socket.on("chat-message", async ({ senderId, receiverId, message }) => {
    console.log(senderId, message)
    const newMessage = {
      senderId,
      receiverId,
      message
    };
    const savedMessage = await SaveChat(newMessage)

    // emit messages both to receiver and sender(ack)
    io.emit(`chat-message-${receiverId}`, savedMessage);
    io.emit(`chat-message-${senderId}`, savedMessage);
  });

  // remove user from online when disconnected
  socket.on("disconnect", () => {
    console.log("disonnected")
    const newOnlineUsers = onlineUsers.filter((item:any) =>item.socketId != socket.id)
    onlineUsers = newOnlineUsers
    io.emit("user-online", newOnlineUsers);
  });
});


db.once("open", () => {
  console.log("mongodb connected")
  server.listen(port, () => console.log(`Server started on port ${port}`));
});
