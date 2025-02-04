import express, { Router } from "express";
import db from "@repo/db/client";

export const chatsRouter:Router = express.Router();

chatsRouter.get("/:chatId/messages", async(req,res)=>{
    try {
        const { chatId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        const offset = (page - 1) * limit;
    
        const totalMessages = await db.message.count({
          where: { chatId },
        });
    
        if (totalMessages === 0) {
           res.status(404).json({ message: "No messages found for this chat." });
           return;
        }
        const chat1 = await db.chat.findFirst({
          where:{
            id:chatId
          }
        })
        if(!chat1){
          res.status(400).json({
            message:"no chat found with the chat id"
          })
          return;
        }

        if(chat1.fromUserId!==req.userId && chat1.toUserId!==req.userId){
          console.log("fromUserId: ",chat1.fromUserId)
          console.log("toUserId: ",chat1.toUserId)
          console.log("userId: ",req.userId)
          res.status(403).json({
            message:"unauthorized"
          })
          return;
        }
    
        const messages = await db.message.findMany({
          where: { chatId },
          skip: offset,
          take: limit,
          orderBy: { dateReceived: "asc" },
          select: {
            id: true,
            fromUserId: true,
            toUserId: true,
            content: true,
            dateReceived: true,
          },
        });
    
        const totalPages = Math.ceil(totalMessages / limit);
    
        res.status(200).json({
          chatId,
          messages: messages.map((msg:any) => ({
            id: msg.id,
            senderId: msg.fromUserId,
            receiverId: msg.toUserId,
            content: msg.content,
            createdAt: msg.dateReceived,
          })),
          page,
          totalPages,
          totalMessages,
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(400).json({
          message: "Failed to fetch messages.",
        });
      }
})

chatsRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        const offset = (page - 1) * limit;
    
        const totalChats = await db.chat.count();
    
        if (totalChats === 0) {
           res.status(404).json({ message: "No chats found." });
           return;
        }
    
        const chats = await db.chat.findMany({
          where:{
            OR:[
              {
                fromUserId:req.userId
              },
              {
                toUserId:req.userId
              }
            ]
          },
          skip: offset,
          take: limit,
          orderBy: { id: "asc" }, 
          select:{
            id:true
            ,fromUserId:true,
            toUserId:true,
            messages:{
              take:1,
              orderBy:{
                dateSend:"desc"
              }
            }
          },
        });
    
        const formattedChats = chats.map((chat:any) => {
          const lastMessage = chat.messages[0] || null;
          return {
            id:chat.id,
            fromUserId: chat.fromUserId,
            lastMessage: lastMessage?.content || null,
            read: lastMessage ? lastMessage.status === "SEEN" : true,
            time: lastMessage?.dateSend || null,
          };
        });
    
        const totalPages = Math.ceil(totalChats / limit);
    
        res.status(200).json({
          chats: formattedChats,
          page,
          totalPages,
          totalChats,
        });
      } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(400).json({
          message: "Failed to fetch chats.",
        });
      }
  });