import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import db from "../db/src";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("req.headers: ", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("auth header not found")
      throw new Error("auth header not found");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("tokne not found");
      throw new Error("token not found");
    }
    const decode = jwt.verify(token!, JWT_SECRET);
    const userId = decode as string;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    req.userId = userId;
    next();
  } catch (e) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
};
