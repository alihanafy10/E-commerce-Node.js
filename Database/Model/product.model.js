
import mongoose from "../global-setup.js";
import slugify from "slugify";
import {
  Badges,
  DiscountType,
  calculateAPPliesPrice,
} from "../../Src/Utils/index.js";
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    //strings section
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      default: function () {
        return slugify(this.title, {
          replacement: "-",
          trim: true,
          lower: true,
        });
      },
    },
    overview: String,
    specs: Object,
    badges: {
      type: String,
      enum: Object.values(Badges),
    },
    //Number Section
    price: {
      type: Number,
      required: true,
      min: 50,
    },
    appliedDiscount: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      type: {
        type: String,
        enum: Object.values(DiscountType),
        default: DiscountType.PERCENT,
      },
    },
    appliedPrice: {
      type: Number,
      required: true,
      default: function () {
        return calculateAPPliesPrice(this.price,this.appliedDiscount);
      },
    }, //peice , peice-discount
    stock: {
      type: Number,
      required: true,
      min: 10,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    //images section
    images: {
      urls: [
        {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
            unique: true,
          },
        },
      ],
      customId: {
        type: String,
        required: true,
        unique: true,
      },
    },
    //ids section
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, //todo true when user is
    },
  },
  { timestamps: true }
);


export const Product =
  mongoose.models.Product || model("Product", productSchema);