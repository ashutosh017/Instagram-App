import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import db from "../db/src";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);
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
