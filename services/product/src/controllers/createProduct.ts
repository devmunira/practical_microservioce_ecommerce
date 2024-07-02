import { Request, Response, NextFunction } from "express";
import { ProductServices } from "@/services/product.services";
import { productCreateDTOSchema } from "@/schema";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = productCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }
    const data = await new ProductServices().createProduct(parseBody?.data);

    return res.status(201).json({
      code: 201,
      message: "Product Created!",
      ...data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default createProduct;
