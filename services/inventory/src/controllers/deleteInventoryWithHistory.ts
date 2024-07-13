import { Request, Response, NextFunction } from "express";
import { inventoryCreateDTOSchema } from "@/schema/index";
import { InventoryServices } from "@/services/inventory.services";

const deleteInventoryWithHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await new InventoryServices().deleteInventory(
      req.params.inventoryId
    );

    return res.status(201).json({
      code: 201,
      message: "Data Deleted!",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default deleteInventoryWithHistory;
