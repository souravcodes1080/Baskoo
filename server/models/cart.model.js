import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
