import { productCreateDTOSchema, productUpdateDTOSchema } from "@/schema";
import { ProductServices } from "@/services/product.services";
import { NextFunction, Request, Response } from "express";

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check Product is exists
    const { productId } = req.params;

    // validate request data
    const parseBody = productUpdateDTOSchema.safeParse(req.body);

    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    const data = await new ProductServices().updateProduct(
      productId,
      parseBody.data
    );

    // return updated data
    return res.status(203).json({
      code: 204,
      message: "Product Updated",
      data,
    });
  } catch (error) {
    console.log("Error logs while update Product for-", error);
    next(error);
  }
};

export default updateProduct;
