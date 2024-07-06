import { ProductServices } from "@/services/product.services";
import { NextFunction, Request, Response } from "express";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await new ProductServices().getProducts();
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

export default getProducts;
