import Chat from "../models/chat";
import BlockList from "../models/block-list"

type ChatMessage = {
  senderId: string;
  receiverId: string;
  message: string;
};

const SaveChat = async (message: ChatMessage) => {
  try {
    
    const savedMessage = await Chat.create(message);

    return savedMessage;
  } catch (e: any) {
    return "error";
  }
};

const GetChatInteraction = async (req: any, res: any) => {
  try {
    const { userId1, userId2 } = req.params;
    
    // find chat interaction between two users
    const chat = await Chat.find({
      $or: [
        {
          $and: [
            { senderId: userId1 },
            { receiverId: userId2 }
          ]
        },
        {
          $and: [
            { senderId: userId2 },
            { receiverId: userId1 }
          ]
        }
      ],
    });

    return res.status(200).send(chat);
  } catch (e: any) {
    return res.status(400).send({ message: "error" });
  }
};

const BlockUser = async (req:any, res:any) => {
    const {userId} = req.params
    const {userIdToBlock} = req.body
    try {
      const user = await BlockList.findOne({userId})

      // if user exists, update blokck list
      // else create new row with an array of only userIdToBlock 
      if(user){
        await BlockList.findOneAndUpdate(
            { userId },
            { $push: { list: userIdToBlock } },
            { new: true }
          );

      } else {
          await BlockList.create({userId, list:[userIdToBlock]})
      }
  
      return res.status(201).send({message: "success"})
    } catch (e: any) {
      console.log(e);
      return res.status(400).send({ message: "error" });
    }
  };


  const GetBlockedList = async (req:any, res:any) => {
    const {userId} = req.params
    try {
      const list = await BlockList.findOne({userId})

      // return object of empty list if record does not exist
      if(!list) return res.status(200).send({list:[]})
      return res.status(200).send(list)

    } catch (e: any) {
      return res.status(400).send({ message: "error" });
    }
  };

export { SaveChat, GetChatInteraction, BlockUser, GetBlockedList };
