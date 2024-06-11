import prisma from "@/config/db";
import { NextFunction, Request, Response } from "express";

const getInventoryByIdWithDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inventoryId } = req.params;
    return await prisma.inventory.findFirst({
      where: { id: inventoryId },
      select: { quantity: true, sku: true, productId: true, histories: true },
    });
  } catch (error) {
    console.log("Error throw while get inventory by Id:" + error);
    next(error);
  }
};

export default getInventoryByIdWithDetails;
