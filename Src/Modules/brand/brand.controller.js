import slugify from "slugify";
import { nanoid } from "nanoid";

import { catchError } from "../../Middleware/index.js";
import { AppEroor, cloudinaryConfig } from "../../Utils/index.js";
import { Brand, Subcategory } from "../../../Database/Model/index.js";

/**
 * @api (post) /brand/creat adds a new brand
 */

const createBrand = catchError(async (req, res, next) => {
  const { subCategory_id, category_id } = req.query;
  //check if subcategory and category already exist
  const isSubCategory = await Subcategory.findById({
    _id: subCategory_id,
    categoryId: category_id,
  }).populate("categoryId");

  if (!isSubCategory) {
    return next(new AppEroor("subCategory not found", 404));
  }

  //distruct data from body
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
      folder: `${process.env.UPLOADE_FOLDER}/Categories/${isSubCategory.categoryId.customId}/subCategorys/${isSubCategory.customId}/Brands/${customId}`,
    }
    );
    
    const brandObj = {
      name,
      slug,
      logo: {
        secure_url,
        public_id,
      },
      customId,
      categoryId: isSubCategory.categoryId._id,
      subcategoryId:isSubCategory._id,
    };

    const newBrand = await Brand.create(brandObj)
    
    res.status(201).json({message:'created successfully',brand:newBrand})
})

/** 
* @api (get) /brand/ get one brand by slug or name or _id
*/
const getBrand = catchError(async (req, res, next) => {
  const { _id, name, slug } = req.query;
  const queryFilter = {};

  if (_id) queryFilter._id = _id;
  if (name) queryFilter.name = name;
    if (slug) queryFilter.slug = slug;
    
  const data = await Brand.findOne(queryFilter);

  if (!data) return next(new AppEroor("brand not found", 404));

  res.status(200).json({ message: "success", data });
});


/** 
* @api (put) /brand/update/:_id update one brand 
*/
const updateBrand= catchError(async (req, res, err) => {
  const { _id } = req.params;

  //get the brand
  const brand = await Brand.findById(_id)
    .populate("categoryId")
    .populate("subcategoryId");
  if (!brand) return next(new AppEroor("brand not found", 404));

  //update name and slug
  const { name } = req.body;
  if (name) {
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
    brand.name = name;
    brand.slug = slug;
  }

  //image
  if (req.file) {
    const spletedPublicId = brand.logo.public_id.split(
      `${brand.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADE_FOLDER}/Categories/${brand.categoryId.customId}/subCategorys/${brand.subcategoryId.customId}/Brands/${brand.customId}`,
        public_id: spletedPublicId,
      }
    );
    brand.logo.secure_url = secure_url;
  }

  //save data
  await brand.save();

  res.status(201).json({ message: "updated successfully", data: brand });
})

/**
 * @api (delete) /brand/delete/:_id delete brand
 */

const deleteBrand = catchError(async (req, res, next) => {
  const { _id } = req.params
  //find and delete from database
  const brand = await Brand.findByIdAndDelete(_id)
    .populate("categoryId")
    .populate("subcategoryId");
  if(!brand) return next(new AppEroor("brand not found",404))

  //delete photo and folder from cloudinary
  const brandPath = `${process.env.UPLOADE_FOLDER}/Categories/${brand.categoryId.customId}/subCategorys/${brand.subcategoryId.customId}/Brands/${brand.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(brandPath)
  await cloudinaryConfig().api.delete_folder(brandPath)

  

  //todo delete realated proudcts

  res.status(200).json({message: 'deleted successfully',data:brand})
 })

export { createBrand, getBrand, updateBrand, deleteBrand };