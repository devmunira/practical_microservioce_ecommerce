import { API_GATEWAY_URL, PRODUCT_URL } from "@/config";
import {
  createInventory,
  deleteInventoryWithHistory,
  getInventoryById,
  getInventoryByIdWithDetails,
  updateInventory,
  updateInventoryByProductId,
} from "@/controllers";
import {
  getInventoryByProductId,
  getLastHistoryByProductId,
} from "@/controllers/getInventoryById";
import { methodNotAllowed } from "@/middlewares";
import { originGuard } from "@/middlewares/originChecker";
import express from "express";
const router = express.Router();

router.put(
  "/inventories/product/:productId",
  originGuard([PRODUCT_URL, API_GATEWAY_URL]),
  methodNotAllowed("put"),
  updateInventoryByProductId
);
router.get(
  "/inventories/last-history/:productId",
  originGuard([PRODUCT_URL]),
  methodNotAllowed("get"),
  getLastHistoryByProductId
);
router.get(
  "/inventories/product/:productId",
  originGuard([PRODUCT_URL, API_GATEWAY_URL]),
  methodNotAllowed("get"),
  getInventoryByProductId
);
router.get(
  "/inventories/:inventoryId/histories",
  originGuard([PRODUCT_URL, API_GATEWAY_URL]),
  methodNotAllowed("get"),
  getInventoryByIdWithDetails
);
router.put(
  "/inventories/:inventoryId",
  originGuard([PRODUCT_URL, API_GATEWAY_URL]),
  methodNotAllowed("put"),
  updateInventory
);
router.get(
  "/inventories/:inventoryId",
  methodNotAllowed("get"),
  originGuard([PRODUCT_URL, API_GATEWAY_URL]),
  getInventoryById
);

router.delete(
  "/inventories/:inventoryId",
  methodNotAllowed("delete"),
  originGuard([PRODUCT_URL]),
  deleteInventoryWithHistory
);

router.post(
  "/inventories",
  methodNotAllowed("post"),
  originGuard([PRODUCT_URL]),
  createInventory
);

export default router;
