import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import db from "@repo/db/client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.headers ", req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("auth header not found  ");
      throw new Error("auth header not found");
    }
    const token = authHeader.split(" ")[1];
    console.log("token ", token); 
    if (!token) {
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
      error: e,
    });
    return;
  }
};
