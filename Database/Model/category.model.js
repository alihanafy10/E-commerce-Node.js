import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, //todo :add true when creating user model
    },
    image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

categorySchema.post("findOneAndDelete", async function () {
  const _id=this.getQuery()._id
  // delete relevent subCategory and brand from db
  const deleteSubCategory = await mongoose.models.Subcategory.deleteMany({
    categoryId: _id,
  });

  if (deleteSubCategory.deletedCount) {
    const deleteBrand = await mongoose.models.Brand.deleteMany({
      categoryId: _id,
    });
    //todo delete relevent products from db
    if (deleteBrand.deletedCount) {
      await mongoose.models.Product.deleteMany({ categoryId: _id });
    }
  }
})

export const Category =
  mongoose.models.Category || model("Category", categorySchema);
