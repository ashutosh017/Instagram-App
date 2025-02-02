import express from "express";
import {
  commentsSchema,
  likedPostsSchema,
  postIdType,
  sharesSchema,
  updatePostSchema,
  uploadPostSchema,
} from "../types";
import db from "../db/src";
import { commentSelect } from "../config";

export const postsRouter = express.Router();

postsRouter.post("/liked-posts", async (req, res) => {
  const parsedSchema = likedPostsSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "post id required",
    });
    return;
  }
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        likedPosts: true,
      },
    });

    if (user?.likedPosts.includes(parsedSchema.data.postId)) {
      res.status(400).json({
        message: "you cannot a like same post twice",
      });
      return;
    }

    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        likedPosts: {
          push: parsedSchema.data.postId,
        },
      },
    });

    res.status(200).json({
      message: "you liked a post",
    });
  } catch (error) {
    res.status(400).json({
      message: "error liking post",
    });
  }
});

postsRouter.get("/liked-posts", async (req, res) => {
  try {
    const user = await db.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        likedPosts: true,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "user not found",
      });
      return;
    }
    const posts = await db.post.findMany({
      where: {
        id: {
          in: user.likedPosts,
        },
      },
      select: {
        url: true,
        comments: {
          select: commentSelect(10),
        },
        likes: true,
        dateCreated: true,
        description: true,
        userId: true,
      },
    });

    res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(400).json({
      message: "error finding liked posts",
    });
  }
});

postsRouter.delete("/liked-posts", async (req, res) => {
  const parsedSchema = likedPostsSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "post id is requried",
    });
    return;
  }
  try {
    const user = await db.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        likedPosts: true,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "user not found",
      });
      return;
    }

    if (!user.likedPosts.includes(parsedSchema.data.postId)) {
      res.status(400).json({
        message: "you cannot dislike a same post twice",
      });
      return;
    }

    const updatedList = user?.likedPosts.filter(
      (id) => id !== parsedSchema.data.postId
    );
    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        likedPosts: {
          set: updatedList,
        },
      },
    });
    res.status(200).json({
      message: "you disliked a post",
    });
  } catch (error) {
    res.status(400).json({
      message: "error disliking a post",
    });
  }
});

postsRouter.post("/comments", async (req, res) => {
  const parsedSchema = commentsSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong comment body type",
    });
    return;
  }
  try {
    const { postId, comment } = parsedSchema.data;
    const post = await db.post.findFirst({
      where:{
        id:postId
      }
    })
    const resp = await db.comment.create({
      data: {
        text: comment,
        dateAdded: new Date(),
        userId: req.userId,
        postId,
      },
    });
    console.log("resp id: ",resp.id)
    res.status(200).json({
      id:resp.id,
      message: "comment added successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: "error while adding comment",
    });
  }
});

postsRouter.post("/shares", async (req, res) => {
  const parsedSchema = sharesSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong share body schema",
    });
    return;
  }
  try {
    const { recipientIds, postId } = parsedSchema.data;
    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!post) {
      res.status(400).json({
        message: "no post found with the given post id",
      });
      return;
    }

    await Promise.all(
      recipientIds.map(async (r) => {
        const chat = await db.chat.upsert({
          where: {
            fromUserId_toUserId: {
              fromUserId: req.userId,
              toUserId: r,
            },
          },
          update: {},
          create: {
            fromUserId: req.userId,
            toUserId: r,
          },
        });
        await db.message.create({
          data: {
            fromUserId: req.userId,
            toUserId: r,
            content: post.url.toString(),
            dateReceived: new Date(),
            chatId: chat.id,
          },
        });
      })
    );

    res.status(200).json({
      message: "chat shared successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error sharing post",
    });
  }
});

postsRouter.post("/", async (req, res) => {
  const parsedSchema = uploadPostSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(200).json({
      message: "wrong upload body type",
    });
    return;
  }
  try {
    const { postUrl, description } = parsedSchema.data;
    const resp = await db.post.create({
      data: {
        url: postUrl,
        description: description,
        userId: req.userId,
      },
    });
    res.status(200).json({
      id: resp.id,
      message: "post uploaded successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error while uploading post",
    });
  }
});

postsRouter.delete("/:postId", async (req, res) => {
  const postIdCheck = postIdType.safeParse(req.params);
  if (!postIdCheck.success) {
    res.status(400).json({
      message: "wrong postId type or post id is empty",
    });
    return;
  }
  const postId = postIdCheck.data.postId;
  try {
    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!post) {
      res.status(400).json({
        message: "no post found with the post id",
      });
      return;
    }
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    res.status(200).json({
      message: "post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error deleting post",
    });
  }
});

postsRouter.post("/saved-posts", async (req, res) => {
  const postIdCheck = postIdType.safeParse(req.body);
  if (!postIdCheck.success) {
    res.status(400).json({
      message: "wrong postId type or post id is empty",
    });
    return;
  }
  const postId = postIdCheck.data.postId;
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });
  if (!post) {
    res.status(400).json({
      message: "no post found with the post id",
    });
    return;
  }
  try {
    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        savedPosts: {
          push: postId,
        },
      },
    });
    res.status(200).json({
      message: "post saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error saving post",
    });
  }
});

postsRouter.get("/saved-posts", async (req, res) => {
  try {
    const posts = await db.post.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        id: true,
        url: true,
      },
    });
    res.status(200).json({
      posts: posts.map((p) => ({
        postId: p.id,
        postUrl: p.url,
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "error getting saved posts",
    });
  }
});

postsRouter.delete("/saved-posts", async (req, res) => {
  console.log("un save post endpoint hit");
  const postIdCheck = postIdType.safeParse(req.query);
  if (!postIdCheck.success) {
    console.log("parsing failed",postIdCheck.error.errors)
    res.status(400).json({
      message: "wrong postId type or post id is empty",
    });
    return;
  }
  const postId = postIdCheck.data.postId;
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });
  if (!post) {
    console.log("postId: ", postId);
    res.status(400).json({
      message: "no post found with the post id",
    });
    return;
  }
  try {
    const user = await db.user.findFirst({
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      throw new Error("user not found");
    }
    const filteredSavedPosts = user.savedPosts.filter(
      (id: any) => id !== postId
    );
    await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        savedPosts: {
          set: filteredSavedPosts,
        },
      },
    });
    res.status(200).json({
      message: "post unsaved successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: "error while saving the post",
      error,
    });
  }
});

postsRouter.get("/:postId", async (req, res) => {
  const postIdCheck = postIdType.safeParse(req.params);
  if (!postIdCheck.success) {
    res.status(400).json({
      message: "wrong postId type or post id is empty",
    });
    return;
  }
  const postId = postIdCheck.data.postId;
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      comments: {
        take: 10,
        select: commentSelect(10),
      },
    },
  });
  if (!post) {
    res.status(400).json({
      message: "no post found with the post id",
    });
    return;
  }
  res.status(200).json({
    postId: post.id,
    postUrl: post.url,
    likes: post.likes,
    comments: post.comments,
    dateCreated: post.dateCreated,
  });
});

postsRouter.put("/", async (req, res) => {
  const parsedSchema = updatePostSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "wrong update post body type",
    });
    return;
  }
  const { postId, description, tags } = parsedSchema.data;

  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });
  if (!post) {
    res.status(400).json({
      message: "no post found with the post id",
    });
    return;
  }
  const creatorId = post.userId;
  if(creatorId!==req.userId){
    res.status(403).json({
      message:"Unauthorized"
    })
    return;
  }
  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        description,
      },
    });
    res.status(200).json({
      message: "post updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "error while updating post",
    });
  }
});
