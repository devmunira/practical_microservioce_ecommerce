import { ProductServices } from "@/services/product.services";
import { NextFunction, Request, Response } from "express";

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const data = await new ProductServices().getProductById(productId);
    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get product details by Id:" + error);
    next(error);
  }
};

export default getProductById;
