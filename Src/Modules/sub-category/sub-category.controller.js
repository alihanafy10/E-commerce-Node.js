import slugify from "slugify";
import { nanoid } from "nanoid";

import { catchError } from "../../Middleware/index.js";
import { AppEroor, cloudinaryConfig } from "../../Utils/index.js";
import { Brand, Category, Subcategory } from "../../../Database/Model/index.js";


/**
 * @api (post) /sub-category/creat adds a new sub-category
 */

const createSubCategory = catchError(async (req, res, next) => {
  //chick category id
  const { categoryId } = req.query;
  const category = await Category.findById(categoryId);
  if (!category) return next(new AppEroor("category not found", 404));

  const { name } = req.body;

  //create slug
  const slug = slugify(name, {
    replacement: "-",
    trim: true,
    lower: true,
  });

  //image
  if (!req.file) {
    return next(new AppEroor("please upload an image", 400));
  }

  //uploade img
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADE_FOLDER}/Categories/${category.customId}/subCategorys/${customId}`,
    }
  );

    //collect category obj
    const subCategoryObj = {
      name,
      slug,
      image: {
        secure_url,
        public_id,
      },
      customId,
      categoryId: category._id,
    };
    const newSubCategory = await Subcategory.create(subCategoryObj)
    
    res.status(201).json({message:'created successfully',data:newSubCategory})
})

/** 
* @api (get) /sub-category/ get one sub-category by slug or name or _id
*/
const getSubCategory = catchError(async (req, res, next) => {
  const { _id, name, slug } = req.query;
  const queryFilter = {};

  if (_id) queryFilter._id = _id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;
 
  const data = await Subcategory.findOne(queryFilter);

  if (!data) return next(new AppEroor("sub-category not found", 404));

  res.status(200).json({ message: "success", data });
});

/** 
* @api (put) /sub-category/update/:_id update one sub-category 
*/
const updateSubCategory = catchError(async (req, res, err) => {
  const { _id } = req.params;

  //get the category
  const subCategory = await Subcategory.findById(_id).populate("categoryId");
  if (!subCategory) return next(new AppEroor("sub-category not found", 404));

  //update name and slug
  const { name } = req.body;
  if (name) {
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
    subCategory.name = name;
    subCategory.slug = slug;
  }

  //image
  if (req.file) {
    const spletedPublicId = subCategory.image.public_id.split(
      `${subCategory.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADE_FOLDER}/Categories/${subCategory.categoryId.customId}/subCategorys/${subCategory.customId}`,
        public_id: spletedPublicId,
      }
    );
    subCategory.image.secure_url = secure_url;
  }

  //save data
  await subCategory.save();

  res.status(201).json({ message: "updated successfully", data: subCategory });
})

/**
 * @api (delete) /sub-category/delete/:_id delete sub-category
 */

const deleteSubCategory = catchError(async (req, res, next) => {
  const { _id } = req.params
  //find and delete from database
  const subcategory = await Subcategory.findByIdAndDelete(_id).populate(
    "categoryId"
  );
  if(!subcategory) return next(new AppEroor("sub-category not found",404))

  //delete photo and folder from cloudinary
  const subcategoryPath = `${process.env.UPLOADE_FOLDER}/Categories/${subcategory.categoryId.customId}/subCategorys/${subcategory.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(subcategoryPath)
  await cloudinaryConfig().api.delete_folder(subcategoryPath)

  
  //delete brand from db 
  await Brand.deleteMany({ subcategoryId: _id });
  
  //todo delete relatev products from db

  res.status(200).json({message: 'deleted successfully',data:subcategory})
 })

export {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};