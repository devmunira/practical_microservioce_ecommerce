import { ProductServices } from "@/services/product.services";
import { NextFunction, Request, Response } from "express";

const getProductByIdWithDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const data = await new ProductServices().getProductDetailsWithHistory(
      productId
    );

    return res.status(200).json({
      code: 200,
      message: "Data Retrieve Successfully",
      data,
    });
  } catch (error) {
    console.log("Error throw while get Product by Id:" + error);
    next(error);
  }
};

export default getProductByIdWithDetails;
