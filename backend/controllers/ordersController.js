import mongoose from "mongoose";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Add new Order
export const addOrder = async (req, res) => {
  try {
    const { userId, products, description, totalAmount, PaymentAddress } =
      req.body;

    const userData = await userModel.findById(userId).select("name").lean();
    if (!userData)
      return res.json({ success: false, message: "User not found" });

    // Generate Native ID: TotalOrders + UserInitials
    const orderCount = await OrderModel.countDocuments();
    const nameParts = userData.name.trim().split(/\s+/);
    const initials =
      nameParts.length > 1
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : userData.name.substring(0, 2).toUpperCase();

    const nativeId = `${orderCount + 1}-${initials}`;

    const newOrder = new OrderModel({
      userId,
      nativeId,
      products,
      description,
      totalAmount: Number(totalAmount).toFixed(2),
      PaymentAddress,
    });

    const savedOrder = await newOrder.save();

    // Clear user cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      nativeId: savedOrder.nativeId,
    });
  } catch (error) {
    res.json({ success: false, message: "Error placing order" });
  }
};

// Get User Orders
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    // 2. Explicitly cast the string ID to an ObjectId for the query
    const orders = await OrderModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
    console.log(orders);
    return orders;
  } catch (error) {
    // 3. Always log the error to your terminal to see the real reason
    console.error("GetOrders Error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};
