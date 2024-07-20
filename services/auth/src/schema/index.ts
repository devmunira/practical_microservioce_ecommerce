import { LoginAttempt, VerificationCodeType } from "@prisma/client";
import { z } from "zod";

export enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPEND = "SUSPEND",
  PENDING = "PENDING",
}

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(3).max(12),
  role: z.nativeEnum(ROLE).optional().default(ROLE.USER),
  status: z.nativeEnum(STATUS).optional().default(STATUS.PENDING),
  isVerified: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string(),
  type: z.nativeEnum(VerificationCodeType),
});

export type createLoginHistory = {
  authId: string;
  userAgent: string;
  ipAddress: string;
  attempt: LoginAttempt;
};

export const emailSchema = loginSchema.omit({ password: true });
export const tokenSchema = z.object({ token: z.string() });

export type registerSchemaDto = z.infer<typeof registerSchema>;
export type loginSchemaDto = z.infer<typeof loginSchema>;
export type verifyEmailSchemaDto = z.infer<typeof emailSchema>;
export type tokenSchemaDto = z.infer<typeof tokenSchema>;
export type verifyCodeSchemaDto = z.infer<typeof verifyCodeSchema>;
