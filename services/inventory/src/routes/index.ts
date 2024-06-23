import {
  createInventory,
  getInventoryById,
  getInventoryByIdWithDetails,
  updateInventory,
} from "@/controllers";
import { methodNotAllowed } from "@/middlewares";
import express from "express";
const router = express.Router();

router.get(
  "/inventories/:inventoryId/histories",
  methodNotAllowed("get"),
  getInventoryByIdWithDetails
);
router.post("/inventories", methodNotAllowed("post"), createInventory);
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

export default router;
