import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_SECRET and REFRESH_TOKEN_SECRET are required");
}

export const createAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const createTokenHash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const saveRefreshToken = async (token, userId) => {
  const tokenHash = createTokenHash(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const refreshToken = new RefreshToken({
    tokenHash: tokenHash,
    userId: userId,
    expiresAt: expiresAt,
  });

  await refreshToken.save();
};

export const verifyRefreshToken = async (plainRefreshToken) => {
  const tokenHash = createTokenHash(plainRefreshToken);
  const storedToken = await RefreshToken.findOne({
    tokenHash: tokenHash,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  return storedToken;
};
