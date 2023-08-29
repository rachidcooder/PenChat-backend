import mongoose from "mongoose";

const chatSchema=mongoose.Schema({
  name:{
    type : String,
     required : true 
  },
isGroupchat:{
  type :Boolean ,
  default : true 
},
users:[{ type : mongoose.Schema.Types.ObjectId , ref :"User"}] ,
groupAdmin :{type :mongoose.Schema.Types.ObjectId ,ref :"User"},
latestMessage :{type :mongoose.Schema.Types.ObjectId,ref :"Message"}
})
export default mongoose.model("Chat",chatSchema);
