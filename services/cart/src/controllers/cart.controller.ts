import { INVENTORY_URL } from "@/config";
import { addToCartSchema } from "@/schema";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = addToCartSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({
        code: 400,
        message: "Bad Request!",
        errors: parseBody.error.errors,
      });
    }

    const { inventoryId, productId, quantity } = parseBody.data;

    // get cart session id
    let cartSessionId = req.headers["x-cart-session-id"] || null;

    // check if cart session id is expired
    if (cartSessionId) {
      // TODO: get cart Session Id from redis
      const redisCartSessionsId = "";

      if (!redisCartSessionsId) {
        cartSessionId = null;
      }
    }

    // if no id exists then create new Id
    if (cartSessionId === null) {
      //   cartSessionId = uuid();
      //TODO: set new session id on redis session id store
    }

    // Check is inventory has stock
    const { data: inventory } = await axios({
      method: "get",
      url: `${INVENTORY_URL}/inventories/${inventoryId}`,
    });

    if (!inventory || inventory?.quantity < quantity) {
      return res.status(404).json({
        code: 404,
        message: "Out of Stock",
      });
    }

    if (inventory && inventory?.quantity > quantity) {
      // TODO: save data to cart store in hash structure

      // update inventory on db
      await axios({
        method: "patch",
        url: `${INVENTORY_URL}/inventories/${inventoryId}`,
        data: {
          actionType: "OUT",
          quantity,
        },
      });
    }

    // Set response header
    res.setHeader("x-cart-session-id", cartSessionId as string);

    return res.status(200).json({
      code: 200,
      message: "Item added to cart",
      cartSessionId,
    });
  } catch (error) {
    console.log(`[Add To Cart] - ${error}`);
    next(error);
  }
};

export const myCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartSessionId = req.headers["x-cart-session-id"];
    if (!cartSessionId) {
      return res.status(400).json({ code: 404, message: "Invalid Request" });
    }

    // TODO: Get Cart data from Store;
  } catch (error) {
    console.log(`[Add To Cart] - ${error}`);
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartSessionId = req.headers["x-cart-session-id"];
    if (!cartSessionId) {
      return res.status(400).json({ code: 404, message: "Invalid Request" });
    }
  } catch (error) {
    console.log(`[Add To Cart] - ${error}`);
    next(error);
  }
};
