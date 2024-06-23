import prisma from "@/config/db";
import { updateInventoryDTOShcema } from "@/schema";
import { InventoryServices } from "@/services/inventory.services";
import { NextFunction, Request, Response } from "express";
const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check inventory is exists
    const { inventoryId } = req.params;

    // validate request data
    const parseBody = updateInventoryDTOShcema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    const data = await new InventoryServices().updateInventory(
      inventoryId,
      parseBody.data
    );

    // return updated data
    return res.status(203).json({
      code: 204,
      message: "Inventory Updated",
      data,
    });
  } catch (error) {
    console.log("Error logs while update inventory for-", error);
    next(error);
  }
};

export default updateInventory;
