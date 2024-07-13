import prisma from "@/config/db";
import { userCreateSchemaDto, userUpdateSchemaDto } from "@/schema";
import { BadRequestError, NotFoundError } from "@/utils";

export class UserServices {
  constructor() {}

  // Create new User
  async createUser(dto: userCreateSchemaDto) {
    const userExists = await prisma.user.findFirst({
      where: { authUserId: dto?.authUserId },
    });

    if (userExists) {
      throw new BadRequestError("User Already Exists");
    }
    return await prisma.user.create({ data: dto });
  }

  // Update User
  async updateUser(userId: string, dto: userUpdateSchemaDto) {
    const userExists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }
    return await prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
  }

  // Get User
  async getUserById(userId: string) {
    const userExists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    return userExists;
  }

  // Get all Users
  async getUsers() {
    return await prisma.user.findMany();
  }

  // Delete User
  async deleteUser(userId: string) {
    const userExists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    await prisma.$transaction(async (prisma) => {
      // TODO: Delete All Associated Data
      // delete user profile
      return await prisma.user.delete({ where: { id: userId } });
    });

    return false;
  }
}
