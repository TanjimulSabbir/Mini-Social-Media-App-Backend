import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser, ISignupUser } from "./auth.interface";
import AppError from "../../utils/errors/app.error";
import httpStatus from "http-status";

const signupUser = async (payload: ISignupUser) => {
  const { name, email, password } = payload;

  // Check user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const userCreateData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { user: userCreateData };
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support.",
      { email },
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("User is blocked!");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  signupUser,
  loginUser,
  refreshToken,
};
