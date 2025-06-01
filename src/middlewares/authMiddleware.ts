import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/ormconfig";
import { Users } from "../entities/User";
import { ErrorCode } from "../enums/ErrorCode";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { message: "No token provided" },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOneBy({ userId: decoded.userId });
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "User not found" },
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    res.status(401).json({
      success: false,
      error: { message: "Invalid token", errorCode: ErrorCode.INVALID_TOKEN },
    });
  }
};
