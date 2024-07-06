import { INVENTORY_URL } from "@/config";
import prisma from "@/config/db";
import { productCreateDTO, productUpdateDTO } from "@/schema";
import { BadRequestError, NotFoundError } from "@/utils";
import axios from "axios";

export class ProductServices {
  constructor() {}

  // Create new Product
  async createProduct(dto: productCreateDTO) {
    console.log({ dto });
    // Step: 1 -> Find Sku isUnique
    const isUnique = await prisma.product.findFirst({
      where: { sku: dto?.sku },
    });

    if (isUnique) {
      throw new BadRequestError("This sku already associated with a product");
    }

    // Step: 2 -> Create Product
    const newProduct = await prisma.product.create({
      data: {
        ...dto,
      },
    });

    // Step: 3 -> Create Inventory
    const inventory: any = await axios.post(
      `${INVENTORY_URL}/api/inventories`,
      {
        productId: newProduct.id,
        sku: newProduct.sku,
        quantity: dto.quantity || 0,
      }
    );

    // Step: 4 -> Update Product with InventoryId
    const updateProduct = await prisma.product.update({
      where: { id: newProduct.id },
      data: { inventoryId: inventory.data?.id },
    });

    // Step: 5 -> Return Modified Data
    return {
      data: {
        ...updateProduct,
        stock: inventory.data.quantity,
        stockStatus: inventory.data.quantity > 0 ? "In Stock" : "Out of Stock",
      },
    };
  }

  // Update Product
  async updateProduct(productId: string, dto: productUpdateDTO) {
    const ProductData = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!ProductData) {
      throw new Error(
        JSON.stringify({ code: "404", message: "Product not found" })
      );
    }

    // update Product
    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: dto?.title || ProductData?.title,
        description: dto?.description || ProductData?.description,
        price: dto?.price || ProductData?.price,
        quantity: dto?.quantity || ProductData?.quantity,
        status: dto?.status || ProductData?.status,
      },
    });

    // get last updated quantity
    const lastUpdatedQuantity = await axios.get(
      `${process.env.INVENTORY_URL}/api/inventories/last-history/${productId}`
    );

    let newQuantity: number = 0; //NOTE: Need to improve this
    let newActionType: "IN" | "OUT" = "IN";

    // calculate quantity
    if (lastUpdatedQuantity?.data && dto?.quantity) {
      if (lastUpdatedQuantity?.data?.actionType === "IN") {
        if (lastUpdatedQuantity?.data?.lastQuantity > dto?.quantity) {
          newQuantity = lastUpdatedQuantity?.data?.lastQuantity - dto?.quantity;
          newActionType = "OUT";
        } else if (lastUpdatedQuantity?.data?.lastQuantity < dto?.quantity) {
          newQuantity = dto?.quantity - lastUpdatedQuantity?.data?.lastQuantity;
          newActionType = "IN";
        }
      } else if (lastUpdatedQuantity?.data?.actionType === "OUT") {
        if (lastUpdatedQuantity?.data?.newQuantity > dto?.quantity) {
          newQuantity = lastUpdatedQuantity?.data?.newQuantity - dto?.quantity;
          newActionType = "OUT";
        } else if (lastUpdatedQuantity?.data?.newQuantity < dto?.quantity) {
          newQuantity = dto?.quantity - lastUpdatedQuantity?.data?.newQuantity;
          newActionType = "IN";
        }
      }
    }

    // update Inventory
    const updatedDataForInventory = {
      productId,
      sku: updateProduct.sku,
      quantity: newQuantity,
      actionType: newActionType,
    };

    const updatedInventory = await axios.put(
      `${process.env.INVENTORY_URL}/api/inventories/product/${productId}`,
      {
        ...updatedDataForInventory,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      ...updateProduct,
      stock: updatedInventory.data.quantity || 0,
      stockStatus:
        updatedInventory.data.quantity > 0 ? "In stock" : "Out of stock",
    };
  }

  // Get Product with history details
  async getProductDetailsWithHistory(productId: string) {
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!data) {
      throw new NotFoundError("Product Data Not Found");
    }

    const inventoryData = await axios.get(
      `${process.env.INVENTORY_URL}/api/inventories/product/${productId}`
    );

    // console.log({ data: inventoryData?.data });

    const history = await axios.get(
      `${process.env.INVENTORY_URL}/api/inventories/${inventoryData?.data?.data?.id}/histories`
    );

    return {
      ...data,
      inventory: inventoryData?.data?.data,
      history: history?.data?.data,
    };
  }

  // Get Product
  async getProductById(ProductId: string) {
    const data = await prisma.product.findFirst({
      where: { id: ProductId },
    });
    if (!data) {
      throw new NotFoundError("Product Data Not Found");
    }

    return data;
  }

  // Get all Products
  async getProducts() {
    return await prisma.product.findMany();
  }

  // Delete Product
  async deleteProduct(productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundError("Product Data Not Found");
    }

    return await prisma.product.delete({
      where: { id: productId },
    });
  }
}
