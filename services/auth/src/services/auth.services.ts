import {
  createLoginHistory,
  registerSchemaDto,
  verifyCodeSchemaDto,
  verifyEmailSchemaDto,
} from "../schema/index";
import prisma from "@/config/db";
import { loginSchemaDto } from "@/schema";
import { BadRequestError, NotFoundError } from "@/utils";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { generateVerificationCode } from "@/utils/code";
import { EMAIL_URL } from "@/config";
import { STATUS, VerificationCodeType } from "@prisma/client";
import { UnAuthorized } from "@/utils/customError";

export class authService {
  constructor() {}

  async createLoginHistory(dto: createLoginHistory) {
    return await prisma.loginHistory.create({ data: { ...dto } });
  }

  // Login
  async login(req: Request, dto: loginSchemaDto) {
    const ipAddress = (req.headers["x-forward-for"] as string) || req.ip || "";
    const userAgent = (req.headers["x-user-agent"] as string) || "";

    // await prisma.$transaction(async (prisma) => {
    const userExists = await prisma.auth.findFirst({
      where: { email: dto?.email },
    });

    if (!userExists) {
      throw new BadRequestError("Invalid Credentials!");
    }

    if (userExists?.status !== "ACTIVE" || !userExists?.isVerified) {
      await this.createLoginHistory({
        authId: userExists?.id,
        ipAddress,
        userAgent,
        attempt: "FAILED",
      });
      throw new BadRequestError("Your account is not active!");
    }

    const comparePass = await bcrypt.compare(
      dto.password,
      userExists?.password
    );
    if (!comparePass) {
      await this.createLoginHistory({
        authId: userExists?.id,
        ipAddress,
        userAgent,
        attempt: "FAILED",
      });
      throw new BadRequestError("Invalid Credentials!");
    }

    const accessToken = jwt.sign(
      {
        userId: userExists?.id,
        email: userExists?.email,
        role: userExists?.role,
        name: userExists?.name,
      },
      process.env.JWT || "!@$%^&",
      { expiresIn: "2h" }
    );

    await this.createLoginHistory({
      authId: userExists?.id,
      ipAddress,
      userAgent,
      attempt: "SUCCESS",
    });

    return accessToken;
  }

  // Register
  async register(dto: registerSchemaDto) {
    const userExists = await prisma.auth.findFirst({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new NotFoundError("User already found");
    }

    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(dto.password, salt);

    // create authUser
    const authUser = await prisma.auth.create({
      data: {
        ...dto,
        password: hashPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });

    // create profile
    await axios({
      method: "post",
      url: `${process.env.USER_URL}/users`,
      data: {
        authUserId: authUser?.id,
        name: dto?.name,
        email: dto?.email,
      },
      headers: {
        origin: process.env.AUTH_URL || "http://localhost:4003",
      },
    });

    // Email Verification
    const code = generateVerificationCode();

    await prisma.verificationCode.create({
      data: {
        authUserId: authUser?.id,
        code,
        type: VerificationCodeType.ACCOUNT_ACTIVATION,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 10),
      },
    });

    await axios({
      method: "post",
      url: `${EMAIL_URL}/emails/send`,
      data: {
        recipient: authUser.email,
        subject: "Verification Code to verify your account",
        body: `Your verification code is ${code}`,
        source: "user-registration",
      },
    });

    return authUser;
  }

  // verify token
  async verifyCode(dto: verifyCodeSchemaDto) {
    let { email, code, type } = dto;
    email = email.toLowerCase();

    // find User
    const user = await prisma.auth.findFirst({
      where: {
        email,
        isVerified: false,
        status: STATUS.PENDING,
      },
      select: {
        password: false,
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new BadRequestError("User not found!");
    }

    // check token
    const hasToken = await prisma.verificationCode.findFirst({
      where: {
        authUserId: user?.id,
        code,
        type,
        //TODO: greater then now Date,
        // expiredAt:
        // isUsed: false, //TODO: Run migration
      },
    });

    if (!hasToken) {
      throw new UnAuthorized("Invalid token!");
    }

    // update token schema
    await prisma.verificationCode.update({
      where: {
        id: hasToken.id,
      },
      data: {
        verifiedAt: Date.now().toString(),
        isUsed: true,
      },
    });

    // update user schema
    await prisma.auth.update({
      where: {
        id: user?.id,
      },
      data: {
        isVerified: true,
        status: STATUS.ACTIVE,
      },
    });

    // send email to user about account activation
    await axios({
      method: "post",
      url: `${EMAIL_URL}/emails/send`,
      data: {
        recipient: user?.email,
        subject: "Account Activation Confirmation.",
        body: "Your account has been successfully activated on our portal",
      },
    });

    // return token with user info
    return user;
  }
}
