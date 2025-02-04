import express from "express";
import {Router} from 'express'
export const usersRouter:Router = Router();
import db from "@repo/db/client";
import {
  changePasswordSchema,
  changePrivacySchema,
  editProfileSchema,
  sendMessageSchema,
} from "../types";
import bcrypt from "bcrypt";
import { commentSelect } from "../config";

usersRouter.get("/search", async (req, res) => {
  const name = req.query.name;
  if (!name || typeof name !== "string") {
    res.status(400).json({
      message: "username is not present",
    });
    return;
  }
  const users = await db.user.findMany({
    where: {
      name,
    },
    select: {
      name: true,
      username: true,
      profilePic: true,
    },
  });

  res.status(200).json({
    users: users.map((u:any) => ({
      name: u.name,
      username: u.username,
      profilePic: u.profilePic,
    })),
  });
});

usersRouter.get("/:userId/metadata", async (req, res) => {
  const userId = req.params.userId;

  const limit = parseInt(req.query.limit as string, 10) || 10;

  const offset = parseInt(req.query.offset as string, 10) || 0;
  if (isNaN(limit) || limit <= 0) {
    res.status(400).json({
      message: "limit must be a positive number",
    });
    return;
  }

  if (isNaN(offset) || offset < 0) {
    res.status(400).json({
      message: "offset must be a non-negative number",
    });
    return;
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      name: true,
      username: true,
      profilePic: true,
      followers: true,
      following: true,
      posts: {
        take: limit,
        skip: offset,
        select: {
          likes: true,
          url: true,
          dateCreated: true,
          description: true,
          // comments: commentSelect(10)
        },
      },
    },
  });

  if (!user) {
    res.status(400).json({
      message: "user not found",
    });
    return;
  }
  res.status(200).json({
    // TODO: come back here
    user,
  });
});

usersRouter.post("/:userId/followers", async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(200).json({
      message: "user id required",
    });
    return;
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
    return;
  }
  try {
    await db.follower.create({
      data: {
        followerId: req.userId,
        userId: userId,
      },
    });
    res.status(200).json({
      message: "You are successfully following: " + user.username,
    });
  } catch (e) {
    res.status(400).json({
      message: "you are already following the user",
    });
  }
});

usersRouter.delete("/:userId/followers", async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400).json({
      message: "userid not found",
    });
    return;
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    res.status(400).json({
      message: "no user found",
    });
    return;
  }
  try {
    await db.follower.delete({
      where: {
        userId_followerId: {
          userId: userId,
          followerId: req.userId,
        },
      },
    });
    res.status(200).json({
      message: "you have successfully unfollowed: " + user.username,
    });
  } catch (error) {
    res.status(400).json({
      message: "you are not following the user",
    });
  }
});

usersRouter.post("/:userId/message", async (req, res) => {
  const userId = req.params.userId;
  const parsedSchema = sendMessageSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "message body is empty",
    });
    return;
  }
  const message = parsedSchema.data.message;
  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }
  try {
    const chatId = await db.$transaction(async () => {
      const chat = await db.chat.upsert({
        where: {
          fromUserId_toUserId: {
            fromUserId: req.userId,
            toUserId: userId,
          },
        },
        update: {},
        create: {
          fromUserId: req.userId,
          toUserId: userId,
        },
      });

      const msg = await db.message.create({
        data: {
          content: message,
          fromUserId: req.userId,
          toUserId: userId,
          chatId: chat.id,
        },
      });
      return msg.chatId
    });
    res.status(200).json({
      chatId:chatId,
      message: "message sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error sending message",
    });
  }
});

usersRouter.put("/profile", async (req, res) => {
  const parsedSchema = editProfileSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "error validating data",
      
    });
    return;
  }
  const { name, username, profilePic, about, gender } = parsedSchema.data;
  try {
    await db.user.update({
      where: {
        id: req.userId, 
      },
      data: {
        name,
        username,
        profilePic,
        description: about,
        gender,
      },
    });

    res.status(200).json({
      message: "user details updated succesfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error updating user details",
    });
  }
});

usersRouter.post("/privacy", async (req, res) => {
  const parsedSchema = changePrivacySchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(200).json({
      message: "wrong privacy type",
    });
    return;
  }

  try {
    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        privacyMode: parsedSchema.data.setTo,
      },
    });
    res.status(200).json({
      message: "privacy mode changed",
    });
  } catch (error) {
    res.status(400).json({
      message: "error while changing privacy mode",
    });
  }
});

usersRouter.post("/password", async (req, res) => {
  const parsedSchema = changePasswordSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong password type",
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedSchema.data.newPassword, 10);
    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error while changing password",
    });
  }
});

usersRouter.get("/followers", async (req, res) => {
  try {
    const followers = await db.follower.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        follower: {
          select: {
            name: true,
            username: true,
            profilePic: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json({
      followers: followers.map((f:any) => ({
        name: f.follower.name,
        username: f.follower.username,
        profilePic: f.follower.profilePic,
        id: f.follower.id,
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "error fetching followers",
    });
  }
});
usersRouter.get("/following", async (req, res) => {
  try {
    const following = await db.follower.findMany({
      where: {
        followerId: req.userId,
      },
      select: {
        user: {
          select: {
            name: true,
            username: true,
            profilePic: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json({
      followers: following.map((f:any) => ({
        name: f.user.name,
        username: f.user.username,
        profilePic: f.user.profilePic,
        id: f.user.id,
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "error fetching following",
    });
  }
});

usersRouter.get("/:userId/posts", async (req, res) => {
  const userId = req.params.userId;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  if (!userId ) {
    res.status(400).json({
      message: "provide user id",
    });
    return;
  }
  try {
    const posts = await db.post.findMany({
      take: limit,
      skip: offset,
      where: {
        userId: userId,
      },
      include: {
        comments:{
          select: commentSelect(2),
        }
      },
    });
    res.status(200).json({
      posts: posts.map((p:any) => ({
        postId: p.id,
        postUrl: p.url,
        likes: p.likes,
        comments: p.comments.map((c:any) => ({
          comment: c.text,
          likes: c.likes,
        })),
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "error fetching posts",
    });
  }
});

usersRouter.get("/feed", async (req, res) => {
  try {
    const feed = await db.follower.findMany({
      where: {
        followerId: req.userId,
      },
      omit: {
        userId: true,
        followerId: true,
        id: true,
      },
      include: {
        user: {
          select: {
            posts: {
              take: 1,
              select: {
                url: true,
                likes: true,
                comments: {
                  select:commentSelect(10),
                },
                dateCreated: true,
                description: true,
                userId: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      feed: feed.map((f:any) => ({
        post: f.user.posts.map((p:any) => ({
          postUrl: p.url,
          dateCreated: p.dateCreated,
          comments: p.comments.map((c:any) => ({
            comment: c.text,
            dateAdded: c.dateAdded,
            likes: c.likes,
          })),
          likes: p.likes,
          description: p.description,
        })),
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "error fetching posts",
    });
  }
});


