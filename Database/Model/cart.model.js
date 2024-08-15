import { calculateCartTotale } from "../../Src/Modules/cart/utils/cart.utils.js";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default:1
            },
            price: {
                type: Number,
                required: true,
            }
      },
        ],
    subTotal:Number
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.subTotal = calculateCartTotale(this.products);
  next()
})

cartSchema.post("save", async function (doc) {
   if (doc.products.length == 0) {
      await Cart.deleteOne({ userId:doc.userId })
  }
 })

export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
