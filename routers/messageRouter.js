import  express from "express";
import protect from "../Middlware/authMiddlware.js";
import {SendMessage ,allMessages} from "../controller/messageController.js"

const MessageRoute=express.Router();

  MessageRoute.post("/",protect,SendMessage);
  MessageRoute.get("/:id",protect,allMessages) ;

 export default MessageRoute
