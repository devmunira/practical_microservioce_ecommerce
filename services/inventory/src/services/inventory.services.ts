import prisma from "@/config/db";
import { InventoryCreateDTO, InventoryUpdateDTO } from "@/schema";
import { NotFoundError } from "@/utils";
import { Prisma } from "@prisma/client";

export class InventoryServices {
  constructor() {}

  // Create new inventory
  async createInventory(dto: InventoryCreateDTO) {
    return await prisma.inventory.create({
      data: {
        ...dto,
        histories: {
          create: {
            actionType: "IN",
            quantityChanged: dto?.quantity || 0,
            lastQuantity: 0,
            newQuantity: dto?.quantity || 0,
          },
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });
  }

  // Update inventory
  async updateInventory(
    id: string,
    dto: InventoryUpdateDTO,
    field: "id" | "productId" = "id"
  ) {
    let where: Prisma.InventoryWhereUniqueInput = { id: id };

    if (field === "productId") {
      where = { productId: id };
    }
    const inventoryData = await prisma.inventory.findUnique({
      where,
    });

    if (!inventoryData) {
      throw new Error(
        JSON.stringify({ code: "404", message: "Inventory not found" })
      );
    }
    // check inventory can sale item
    if (inventoryData?.quantity < dto?.quantity && dto?.actionType === "OUT") {
      throw new Error(
        JSON.stringify({ code: "400", message: "Inventory stock out" })
      );
    }

    let newQuantity = +inventoryData.quantity;
    newQuantity =
      dto.actionType === "IN"
        ? newQuantity + dto.quantity
        : newQuantity - dto.quantity;

    // update inventory qty && create new entry on history
    return await prisma.inventory.update({
      where,
      data: {
        quantity: newQuantity,
        histories: {
          create: {
            actionType: dto.actionType,
            lastQuantity: inventoryData.quantity,
            quantityChanged: dto.quantity,
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
  }

  // Get inventory with history details
  async getInventoryDetailsWithHistory(inventoryId: string) {
    const data = await prisma.inventory.findFirst({
      where: { id: inventoryId },
      select: { quantity: true, sku: true, productId: true, histories: true },
    });

    if (!data) {
      throw new NotFoundError("Inventory Data Not Found");
    }

    return data;
  }

  // Get inventory
  async getInventoryDetailsById(inventoryId: string) {
    const data = await prisma.inventory.findFirst({
      where: { id: inventoryId },
    });
    if (!data) {
      throw new NotFoundError("Inventory Data Not Found");
    }

    return data;
  }

  // get inventory by productId
  async getInventoryDetailsByProductId(productId: string) {
    const data = await prisma.inventory.findFirst({
      where: { productId: productId },
    });
    if (!data) {
      throw new NotFoundError("Inventory Data Not Found");
    }

    return data;
  }

  // Get inventory
  async getLastInventoryUpdateDetails(productId: string) {
    const inventory = await prisma.inventory.findFirst({
      where: { productId: productId },
    });

    if (!inventory) {
      return false;
    }

    const lastHistory = await prisma.history.findFirst({
      where: { inventoryId: inventory?.id },
      orderBy: { createdAt: "desc" },
    });

    return lastHistory;
  }
}
