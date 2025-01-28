import express from "express";
import db from "../db/src";
import { replyToCommentSchema } from "../types";

export const commentsRouter = express.Router();

commentsRouter.get("/replies", async (req, res) => {
  const parsedSchema = replyToCommentSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong reply body type",
    });
    return;
  }
  const { commentId, reply, postId } = parsedSchema.data;
  const comment = await db.comment.create({
    data: {
      text: reply,
      postId,
      userId: req.userId,
      dateAdded: new Date(),
    },
  });
  try {
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        replies: {
          create: comment,
        },
      },
    });
    res.status(200).json({
      message: "reply added successfully",
    });
  } catch (error) {
    res.status(400).json({
      message:
        "error while adding reply or comment not found with the provided comment id",
    });
  }
});

