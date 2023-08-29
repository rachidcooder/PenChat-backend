import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema=mongoose.Schema({
  name:{
    type :String ,
    required : true
  },
  email : {
    type : String ,
    required : true,
    unique : true
  } ,
  password : {
    type :String ,
    min:6
  },
  pic :{
    type : String,
    required :true,
    default  :"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  },
  isAdmine : {
    type : Boolean,
    default :false,
    required :true
  }
},{timestamp:true})
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User=mongoose.model("User",userSchema);
export default User;