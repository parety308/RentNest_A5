"use server"
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error:any) {
    return {
      success: false,
      error: error?.message
    }
  }
}

export const jwtUtils = {  verifyToken };