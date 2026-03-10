import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    nativeId: { type: String, required: true, unique: true }, // e.g., "1-AC"
    products: { type: Array, required: true },
    description: { type: String, required: true },
    totalAmount: {
      type: Number,
      required: true,
      transform: (v) => Number(v.toFixed(2)),
    },
    PaymentAddress: { type: String, required: true },
    status: { type: String, default: "Food Processing" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
