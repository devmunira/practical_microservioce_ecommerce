import prisma from "@/config/db";
import { NextFunction, Request, Response } from "express";

const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inventoryId } = req.params;
    return await prisma.inventory.findFirst({ where: { id: inventoryId } });
  } catch (error) {
    console.log("Error throw while get inventory by Id:" + error);
    next(error);
  }
};

export default getInventoryById;
