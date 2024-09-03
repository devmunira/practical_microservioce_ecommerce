import prisma from "@/config/db";
import { Request, Response, NextFunction } from "express";

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        ordersItems: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export default getOrderById;
