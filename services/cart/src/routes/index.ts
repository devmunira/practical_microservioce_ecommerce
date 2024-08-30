import { addToCart, clearCart, myCart } from "@/controllers/cart.controller";
import { methodNotAllowed } from "@/middlewares";
import express from "express";
const router = express.Router();

router.post("/cart/add", methodNotAllowed("post"), addToCart);
router.get("/cart/me", methodNotAllowed("get"), myCart);
router.delete("/cart/clear", methodNotAllowed("delete"), clearCart);

export default router;
