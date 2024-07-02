import {
  createInventory,
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
import express from "express";
const router = express.Router();

router.put(
  "/inventories/product/:productId",
  methodNotAllowed("put"),
  updateInventoryByProductId
);
router.get(
  "/inventories/last-history/:productId",
  methodNotAllowed("get"),
  getLastHistoryByProductId
);
router.get(
  "/inventories/product/:productId",
  methodNotAllowed("get"),
  getInventoryByProductId
);
router.get(
  "/inventories/:inventoryId/histories",
  methodNotAllowed("get"),
  getInventoryByIdWithDetails
);
router.put(
  "/inventories/:inventoryId",
  methodNotAllowed("put"),
  updateInventory
);
router.get(
  "/inventories/:inventoryId",
  methodNotAllowed("get"),
  getInventoryById
);
router.get(
  "/inventories/:inventoryId",
  methodNotAllowed("get"),
  getInventoryById
);
router.post("/inventories", methodNotAllowed("post"), createInventory);

export default router;
