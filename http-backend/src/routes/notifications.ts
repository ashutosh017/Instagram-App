import express from "express";
import db from "../db/src";

export const notificationsRouter = express.Router();

notificationsRouter.get("/",async(req,res)=>{
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10
    const offset = (page - 1) * limit;


    try {
        const notifications = await db.notification.findMany({
            take:limit,
            skip:offset,
            where:{
                forUserId:req.userId
            }
        })
        res.status(200).json({
            notifications:notifications.map((n:any)=>({
                id:n.id,
                content:n.notificationContent,
                time:n.time,
                seen:n.read,
                type:n.type
            }))
        })
    } catch (error) {
        res.status(400).json({
            message:"error finding notifications"
        })
    }
})

notificationsRouter.patch("/:notificationId",async(req,res)=>{
    const notificationId = req.params.notificationId;
    if(!notificationId || typeof notificationId!=='string'){
        res.status(400).json({
            message:"wrong notification id type or notification id not found"
        })
        return;
    }
    try {
        await db.notification.update({
            where:{
                id:notificationId
            },data:{
                read:true
            }
        })
        res.status(200).json({
            message:"notfication marked as read successfully"
        })
    } catch (error) {
        res.status(400).json({
            message:"error marking notification as read or notification with the provided id not found"
        })
    }
})

