import {
  createInventory,
  getInventoryById,
  getInventoryByIdWithDetails,
  updateInventory,
} from "@/controllers";
import express from "express";
const router = express.Router();

router.get("/inventories/:inventoryId/histories", getInventoryByIdWithDetails);
router.post("/inventories", createInventory);
router.put("/inventories/:inventoryId", updateInventory);
router.get("/inventories/:inventoryId", getInventoryById);

export default router;
