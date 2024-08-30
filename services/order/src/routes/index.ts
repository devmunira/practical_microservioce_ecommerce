import checkout from "@/controllers/checkout";
import getOrders from "@/controllers/getAllOrders";
import getOrderById from "@/controllers/getOrderDetails";
import express from "express";
const router = express.Router();

router.post("/orders/checkout", checkout);
router.get("/orders/:id", getOrderById);
router.get("/orders", getOrders);

export default router;
