import { createInventory, updateInventory } from "@/controllers";
import express from "express";
const router = express.Router();

router.post("/inventories", createInventory);
router.put("/inventories/:inventoryId", updateInventory);

export default router;
