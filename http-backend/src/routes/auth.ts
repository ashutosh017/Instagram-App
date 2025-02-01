import express from "express";
// import db from "@db/src";
import db from "../db/src";
import { signinSchema, signupSchema } from "../types";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();

authRouter.post("/signin", async (req, res) => {
  const parsedSchema = signinSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }
  const { username, password } = parsedSchema.data;
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    res.status(400).json({
      message: "either username or password is wrong", // we are writing same here because we don't wan't to tell user
      // wheather he is entering right username/password or wrong for security
    });
    return;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({
      message: "either username or password is wrong",
    });
  }
  const token = jwt.sign(user.id, JWT_SECRET);
  res.status(200).json({
    message: "signin success",
    token:token,
  });
});

authRouter.post("/signup", async (req, res) => {
  const parsedSchema = signupSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const { name, email, username, password, profilePic } = parsedSchema.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        email,
        profilePic,
      },
    });

    res.status(200).json({
      message: "signup successful",
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({
      message: "signup failed",
      reason: error,
    });
  }
});
