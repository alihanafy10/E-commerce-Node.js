import { CouponType, orderStatusType, paymentMethodType } from "../../Src/Utils/index.js";
import mongoose from "../global-setup.js";
import { Coupon, Product } from "./index.js";
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    fromCart: {
      type: Boolean,
      default: true,
    },
    address: String,
    addressId: {
      type: String,
      ref: "Address",
    },
    contactNumber: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    total: {
      type: Number,
      required: true,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(paymentMethodType),
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(orderStatusType),
    },
    deliveredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deliveredAt: Date,
    cancelledAt: Date, 
  },
  { timestamps: true }
);

orderSchema.post('save',async function () {
  for (const element of this.products) {
    await Product.updateOne({ _id: element.productId }, { $inc: { stock :-element.quantity} });
  }
  if (this.couponId) {
    const coupon = await Coupon.findById(this.couponId);
    coupon.users.find((u) => u.userId.toString() == this.userId.toString()).useageCount++;
    await coupon.save();
  }
})

export const Orders =
  mongoose.models.Orders || model("Orders", orderSchema);
