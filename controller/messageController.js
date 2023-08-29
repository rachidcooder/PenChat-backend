import Message from "../model/messageModel.js"
import Chat from "../model/chatModel.js"
import User from "../model/userModel.js";


//@description     Send Messages
//@route           POST /api/message
//@access          Protected
export const SendMessage = async(req,res)=>{
 const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try{
   let message= await Message.create(newMessage);
    message = await message.populate("sender","name pic ") ;
    message = await message.populate("chat") ;

     message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
  //latest Message 
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.json(message);
  }catch(err){
    console.error(err)
  }
}

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = async (req, res) => {
  const chatId =req.params.id 
  try {
    const messages = await Message.find({ chat:chatId })
        .populate("sender", "name pic email")
        .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

