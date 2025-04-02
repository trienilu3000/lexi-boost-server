import jwt from "jsonwebtoken";
import { Users } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user: Users): string => {
    return jwt.sign(
        { id: user.userId, email: user.email, role: user.role.name },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (user: Users): string => {
    return jwt.sign(
        { id: user.userId, email: user.email, role: user.role.name },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
    );
};
