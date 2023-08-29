import express from "express"
import {Register,Login,getAllUsers} from "../controller/userController.js"
import protect from "../Middlware/authMiddlware.js";


const route =express.Router();
//
route.post("/",Register);
route.post("/login",Login);
route.get("/users",protect,getAllUsers);

export default route;
