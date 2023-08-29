import User from "../model/userModel.js";
import Message from "../model/messageModel.js"
import Chat from "../model/chatModel.js"


//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export  const AccessChat=async(req,res)=>{
   const {userId}=req.body
    if(!userId){
      console.log("user id not sent with request") ;
    }

    let isChat= await Chat.find(
      { isGroupchat:false,
        $and :[
         { users:{  $elemMatch: { $eq: req.user._id } }},
         { users:{  $elemMatch: { $eq: userId}}}
        ]
      }
      )  .populate("users", "-password")
    .populate("latestMessage");

   isChat=await User.populate(isChat ,{
      path: "latestMessage.sender" ,
      select: "name pic email"     ,
  })

    if(isChat.length >0){
       res.send(isChat[0]);
     }
     else{
      var chatData={
        name : "sender" ,
        isGroupchat:false   ,
        users :[req.user._id, userId]
      }

      try{
      const createChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);

      }catch(err){
        console.error(err);
      } }

   }
   
//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
 export const fetchChats=async(req,res)=>{ 
  try{
    const chats= await Chat.find({ users :{ $elemMatch: { $eq :req.user._id}}})
         .populate("users","-password")
         .populate("groupAdmin",'-password')
         .populate('latestMessage')
         .sort({updateAt:-1})
         .then(async(result) => {
            result = await User.populate(result,{
              path: "latestMessage.sender",
              select : 'name pic email'
            })

          res.json({result});

         }).catch((err) => {
             console.log(err) ;
         });           


  }catch(err){
    console.log(err)
  }
}

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected


// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected



// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected



// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
