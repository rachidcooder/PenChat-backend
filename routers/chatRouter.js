import  express  from "express";
 import protect from "../Middlware/authMiddlware.js";
import {AccessChat,fetchChats} from "../controller/chatConntroller.js"


const RouteChat=express.Router();

RouteChat.get("/",protect,fetchChats);
RouteChat.post("/",protect,AccessChat);

export default RouteChat
