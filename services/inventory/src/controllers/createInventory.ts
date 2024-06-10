import { Request, Response, NextFunction } from "express";
import prisma from "@/config/db";
import { inventoryCreateDTOSchema } from "@/schema/index";

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = inventoryCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // create inventory and history
    const data = await prisma.inventory.create({
      data: {
        ...parseBody.data,
        histories: {
          create: {
            actionType: "IN",
            quantityChanged: parseBody?.data?.quantity || 0,
            lastQuantity: 0,
            newQuantity: parseBody?.data?.quantity || 0,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export default createInventory;
