import prisma from "@/config/db";
import { InventoryServices } from "@/services/inventory.services";
import response from "@/utils/response";
import { NextFunction, Request, Response } from "express";

const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inventoryId } = req.params;
    const data = await new InventoryServices().getInventoryDetailsById(
      inventoryId
    );
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get inventory by Id:" + error);
    next(error);
  }
};

const getLastHistoryByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const data = await new InventoryServices().getInventoryDetailsByProductId(
      productId
    );
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get inventory by Id:" + error);
    next(error);
  }
};

const getInventoryByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const data = await new InventoryServices().getInventoryDetailsByProductId(
      productId
    );
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get inventory by Id:" + error);
    next(error);
  }
};

export { getInventoryById, getLastHistoryByProductId, getInventoryByProductId };
