import prisma from "@/config/db";
import { updateInventoryDTOShcema } from "@/schema";
import { NextFunction, Request, Response } from "express";
const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check inventory is exists
    const { inventoryId } = req.params;
    const inventoryData = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryData) {
      return res.status(400).json({ error: "Inventory not found." });
    }

    // validate request data
    const parseBody = updateInventoryDTOShcema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // check inventory can sale item
    if (
      inventoryData?.quantity < parseBody?.data?.quantity &&
      parseBody?.data?.acyionType === "OUT"
    ) {
      return res
        .status(400)
        .json({ error: "Inventory stock is too low for sale!" });
    }

    let newQuantity = +inventoryData.quantity;
    newQuantity =
      parseBody.data.acyionType === "IN"
        ? newQuantity + parseBody.data.quantity
        : newQuantity - parseBody.data.quantity;

    // update inventory qty && create new entry on history
    const newData = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: newQuantity,
        histories: {
          create: {
            actionType: parseBody.data.acyionType,
            lastQuantity: inventoryData.quantity,
            quantityChanged: parseBody.data.quantity,
            newQuantity,
          },
        },
      },
      select: {
        quantity: true,
        productId: true,
        histories: true,
      },
    });

    // return updated data
    return res.status(203).json(newData);
  } catch (error) {
    console.log("Error logs while update inventory for-", error);
    next(error);
  }
};

export default updateInventory;
