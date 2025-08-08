import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, "Provide order ID"],
      unique: true,
    },
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    product_details: {
      _id: String,
      name: String,
      image: Array,
    },
    payment_id: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
    delivery_status: {
      type: String,
      enum: ["Processing", "On the way", "Delivered"],
      default: "Processing",
    },
    sub_total_amt: {
      type: Number,
      default: 0,
    },
    total_amt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
