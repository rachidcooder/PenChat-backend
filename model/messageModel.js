import mongoose from "mongoose";

const MsgSchema=mongoose.Schema({
  content:{
    type : String,
     required : true 
  },
  chat : {
    type : mongoose.Schema.Types.ObjectId, ref:"Chat"
  }
  ,
  sender :{ type : mongoose.Schema.Types.ObjectId ,ref :"User"},
  readBy :[{type :mongoose.Schema.Types.ObjectId ,ref :"User"}]
},{timestamps :true})
export default mongoose.model("Message",MsgSchema); 