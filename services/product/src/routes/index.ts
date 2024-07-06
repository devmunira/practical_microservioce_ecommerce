import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductByIdWithDetails,
  updateProduct,
  getProducts,
} from "@/controllers";
import { methodNotAllowed } from "@/middlewares";
import express from "express";
const router = express.Router();

router.get(
  "/products/:productId/inventory",
  methodNotAllowed("get"),
  getProductByIdWithDetails
);
router.post("/products", methodNotAllowed("post"), createProduct);
router.get("/products", methodNotAllowed("get"), getProducts);
router.put("/products/:productId", methodNotAllowed("put"), updateProduct);
router.delete(
  "/products/:productId",
  methodNotAllowed("delete"),
  deleteProduct
);
router.get("/products/:productId", methodNotAllowed("get"), getProductById);

export default router;
