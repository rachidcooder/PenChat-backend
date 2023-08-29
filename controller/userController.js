import express, { json } from "express";
import User from "../model/userModel.js"
import generateToken from "../config/generateToken.js";


//Register : POST 
export const Register=async(req,res)=>{
  const {name,email,password}=req.body;
  
  if(name!==""&&email!==""&&password!==""){
    try{
    let user= await User.findOne({email});
      if(user){
               return res.json({msg : "User already existe !"});
      }

      user = await User.create({name,email,password});
       
       res.json({
        "id":user._id,
        "name" :user.name,
        "email":user.email,
        "pic":user.pic,
        "isAdmine":user.isAdmine,
        token : generateToken(user._id)
       })
  }catch(err){
     console.error(err);
  }
}else{
  res.status(400);
    throw new Error("Please Enter all the Feilds");
}

}
//Login : POST
export const Login=async(req,res)=>{
   const {email,password}=req.body;

      try{
        const isUser=await User.findOne({email});
        if(!isUser) return res.json({msg : "email or password invalid!"});

      const isSamePssword=await isUser.matchPassword(password);
        if(!isSamePssword ) return res.json({msg : "email or password invalid!"});


 res.status(200).json({ 
        "id":isUser._id,
        "name" :isUser.name,
        "email":isUser.email,
        "pic":isUser.pic,
        "isAdmine":isUser.isAdmine,
        token : generateToken(isUser._id)
       })

      }catch(err){
        console.log(err);
      }

    }

//AllUser : GET
export const getAllUsers=async(req,res)=>{
  try{
        const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
   
    console.log("")
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);

  }catch(err){
    console.error(err) ;
  }
}

