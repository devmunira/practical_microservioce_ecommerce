import { createInventory } from "@/controllers";
import express from "express";
const router = express.Router();

router.post("/inventories", createInventory);

export default router;
