import express, { Router } from "express";
import db from "@repo/db/client";
import { replyToCommentSchema } from "../types";

export const commentsRouter:Router = express.Router();

commentsRouter.post("/replies", async (req, res) => {
  const parsedSchema = replyToCommentSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong reply body type",
    });
    return;
  }
  const { commentId, reply, postId } = parsedSchema.data;
 
  try {
    const replyRes = await db.comment.create({
      data: {
        text: reply,
        postId,
        userId: req.userId,
        dateAdded: new Date(),
        parentId:commentId
  
      },
    });
    res.status(200).json({
      replyId:replyRes.id,
      message: "reply added successfully",
    });
  } catch (error) {
    console.error(error)
    res.status(400).json({
      message:
        "error while adding reply or comment not found with the provided comment id",
    });
  }
});

