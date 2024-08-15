import { CouponType } from "../../Src/Utils/index.js";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    couponType: {
      type: String,
      required: true,
      enum: Object.values(CouponType),
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        maxCount: {
          type: Number,
          required: true,
          min: 1,
        },
        useageCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    isEnable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
  },
  { timestamps: true }
);



export const Coupon =
  mongoose.models.Coupon || model("Coupon", couponSchema);


//logs the coupon
  
const logsCouponChangeSchema = new Schema(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Coupon",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    changes: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
export const Couponlogs =
  mongoose.models.Couponlogs || model("Couponlogs", logsCouponChangeSchema);