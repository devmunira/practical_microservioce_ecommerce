import { INVENTORY_URL } from "@/config";
import prisma from "@/config/db";
import { productCreateDTO, productUpdateDTO } from "@/schema";
import { BadRequestError, NotFoundError } from "@/utils";
import axios from "axios";

export class ProductServices {
  constructor() {}

  // Create new Product
  async createProduct(dto: productCreateDTO) {
    return await prisma.$transaction(async (prisma) => {
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
      const inventory: any = await axios({
        method: "post",
        url: `${INVENTORY_URL}/inventories`,
        data: {
          productId: newProduct.id,
          sku: newProduct.sku,
        },
        headers: {
          origin: "http://localhost:4001",
        },
      });

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
          stockStatus:
            inventory.data.quantity > 0 ? "In Stock" : "Out of Stock",
        },
      };
    });
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
        status: dto?.status || ProductData?.status,
      },
    });

    return {
      ...updateProduct,
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
      `${process.env.INVENTORY_URL}/inventories/product/${productId}`
    );

    const history = await axios.get(
      `${process.env.INVENTORY_URL}/inventories/${inventoryData?.data?.data?.id}/histories`
    );

    return {
      ...data,
      inventory: inventoryData?.data?.data || {},
      history: history?.data?.data || [],
    };
  }

  // Get Product
  async getProductById(productId: string) {
    const data = await prisma.product.findFirst({
      where: { id: productId },
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
    return await prisma?.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product && product?.inventoryId) {
        // history & inventory delete
        await axios({
          method: "delete",
          url: `${process.env.INVENTORY_URL}/inventories/${product?.inventoryId}`,
        });
      }

      // product delete
      return await prisma.product.delete({ where: { id: productId } });
    });
  }
}
