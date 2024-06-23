import { Request, Response, NextFunction } from "express";
import prisma from "@/config/db";
import { inventoryCreateDTOSchema } from "@/schema/index";
import { InventoryServices } from "@/services/inventory.services";

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
    const data = await new InventoryServices().createInventory(parseBody?.data);

    return res.status(201).json({
      code: 201,
      message: "Data Created!",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default createInventory;
