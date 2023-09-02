import express from "express";
import cors from 'cors'
import  dotenv from "dotenv"
import connectDB from "./config/db.js"
import Userroute from "./routers/userRouter.js";
import MessageRoute from "./routers/messageRouter.js";
import chatRoute from "./routers/chatRouter.js";
import path from "path";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app =express();  
const PORT=process.env.PORT||3001;
 
app.use(express.json());
app.use(cors({
  origin: 'https://panchat-api-1p4l.onrender.com', // Set the origin of your frontend
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

connectDB();

 app.use("/api/user",Userroute);
 app.use("/api/chat",chatRoute);
app.use("/api/message",MessageRoute);
app.use("*",(req,res)=>{
  res.send("<h1>Error 404 Not Found!</h1>");
})

const server = http.createServer(app);

const io = new Server(server,{
    pingTimeout: 60000,
  cors: {
    origin: "https://panchat-api-1p4l.onrender.com",
    credentials: true,
  }});

  server.listen(PORT,()=>{
  console.log("listening to the port : ",PORT);
})


io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected t Id",userData.id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id)  return ;
        
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

