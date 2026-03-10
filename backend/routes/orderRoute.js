import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addOrder, getOrders } from "../controllers/ordersController.js";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, addOrder);
orderRouter.post("/getOrders", authMiddleware, getOrders);

export default orderRouter;
