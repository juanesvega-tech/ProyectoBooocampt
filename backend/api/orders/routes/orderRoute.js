import express from "express";
import { createOrder, getOrders, assignOrder, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/assign", assignOrder);
router.put("/:orderId/status", updateOrderStatus);
router.delete("/:orderId", deleteOrder);

export default router;
