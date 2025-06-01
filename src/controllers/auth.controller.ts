import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Users } from "../entities/User";
import { Role } from "../entities/Role";
import { RevokedToken } from "../entities/RevokedToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import { Profile } from "../entities/Profile";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfoResponse,
} from "../interfaces/auth/Auth";
import { ErrorCode } from "../enums/ErrorCode";
import { seedRoles } from "../seeders/roleSeeder";

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response<RegisterResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, password, roleName = "user" } = req.body;
    const userRepository = AppDataSource.getRepository(Users);
    const roleRepository = AppDataSource.getRepository(Role);
    const profileRepository = AppDataSource.getRepository(Profile);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: {
          errorCode: ErrorCode.EMAIL_EXISTS,
          message: "Email already exists",
        },
      });
      return;
    }

    const role = await roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      res.status(400).json({
        success: false,
        error: { errorCode: ErrorCode.INVALID_ROLE, message: "Invalid role" },
      });
      seedRoles();
      return;
    }

    const newProfile = profileRepository.create();
    await profileRepository.save(newProfile);

    const newUser = userRepository.create({
      fullName,
      email,
      password,
      role,
      profile: newProfile,
    });
    await userRepository.save(newUser);

    res.status(201).json({
      success: true,
      data: { message: "User registered successfully" },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<LoginResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(Users);
    console.log("userRepository ==> ", userRepository);

    const user = await userRepository.findOne({
      where: { email },
      relations: ["role"],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        success: false,
        error: {
          errorCode: ErrorCode.INVALID_CREDENTIALS,
          message: "That email and password combination is incorrect.",
        },
      });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ success: true, data: { accessToken: accessToken } });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response<RefreshTokenResponse>
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: { errorCode: ErrorCode.TOKEN_EXPIRED, message: "Unauthorized" },
    });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({
          success: false,
          error: { errorCode: ErrorCode.FORBIDDEN, message: "Invalid token" },
        });
        return;
      }

      const accessToken = generateAccessToken(decoded);
      res.json({ success: true, data: { accessToken: accessToken } });
    }
  );
};

export const logout = async (
  req: Request,
  res: Response<LogoutResponse>
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const revokedTokenRepository = AppDataSource.getRepository(RevokedToken);
    const revokedToken = revokedTokenRepository.create({ token: refreshToken });
    await revokedTokenRepository.save(revokedToken);
  }
  res.clearCookie("refreshToken");
  res.json({ success: true, data: { message: "Logged out successfully" } });
};

export const getUserInfo = async (
  req: Request,
  res: Response<UserInfoResponse>
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: { errorCode: ErrorCode.UNAUTHORIZED, message: "Unauthorized" },
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    console.log("decoded ==> ", decoded);

    if (!decoded || !decoded.id) {
      res.status(403).json({
        success: false,
        error: { errorCode: ErrorCode.FORBIDDEN, message: "Invalid token" },
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOne({
      where: { userId: decoded.id },
      relations: ["role", "profile"],
    });
    console.log("user ==> ", user);
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
        profile: {
          ...user.profile,
          phone: user.profile.phone || "",
          bio: user.profile.bio || "",
          address: user.profile.address || "",
          birthday: user.profile.birthday || "",
          avatarUrl: user.profile.avatarUrl || "",
        },
      },
    });
  } catch (error) {
    console.log("error ==> ", error);
  }
};
