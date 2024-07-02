import { ProductServices } from "@/services/product.services";
import { NextFunction, Request, Response } from "express";

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check Product is exists
    const { ProductId } = req.params;

    await new ProductServices().deleteProduct(ProductId);

    // return updated data
    return res.status(204).json({
      code: 204,
      message: "Product has been deleted with Product history",
    });
  } catch (error) {
    console.log("Error logs while delete product for-", error);
    next(error);
  }
};

export default deleteProduct;
