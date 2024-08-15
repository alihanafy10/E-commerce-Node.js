import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    builidingNumber: {
      type: Number,
      required: true,
    },
    flooreNumber: {
      type: Number,
      required: true,
    },
    addressLable: String,
    isDefualt: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Address =
  mongoose.models.Address || model("Address", addressSchema);
