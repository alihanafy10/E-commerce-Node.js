import slugify from 'slugify'
import { nanoid } from "nanoid";

import { catchError } from "../../Middleware/index.js";
import { AppEroor, cloudinaryConfig } from "../../Utils/index.js";
import { Brand, Category, Subcategory } from '../../../Database/Model/index.js';



/**
 * @api (post) /category/creat adds a new category
 */
const createCategory = catchError(async (req, res, next) => {
    //distruct data from body
    const { name } = req.body

    //create slug
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
    //image
    if (!req.file) {
        return next(new AppEroor("please upload an image",400));
    }
    //uploade image to cloudinary
    const customId = nanoid(5);
    const {secure_url,public_id} = await cloudinaryConfig().uploader.upload(req.file.path, {
      folder: `${process.env.UPLOADE_FOLDER}/Categories/${customId}`,
    });

    //collect category obj
    const category = {
      name,
      slug,
      image: {
        secure_url,
        public_id,
      },
      customId,
    };

    //create category
    const data=await Category.create(category)
    
    //response
    res.status(201).json({ message: "success", data });
})

/** 
* @api (get) /category/ get one category by slug or name or _id
*/
const getCategory = catchError(async (req, res, next) => {
  const { _id, name, slug } = req.query
  const queryFilter = {}
  
  if(_id)queryFilter._id=_id
  if(name)queryFilter.name=name
  if (slug) queryFilter.slug = slug
  console.log(queryFilter);
  const data = await Category.findOne(queryFilter)

  if (!data) return next(new AppEroor('Category not found', 404))
  
  res.status(200).json({message:'success', data})

})

/**
 * @api (put) /category/update/:_id update name or img
 */
const updateCategory = catchError(async (req, res, next) => {

  const { _id } = req.params
  //get the category
  const category = await Category.findById(_id)
  if(!category)return next(new AppEroor('Category not found', 404))

  //update name
  const { name } = req.body
  
  if (name) {
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
    category.name = name
    category.slug = slug
  }

  //update img
  if (req.file) {
    const spletedPublicId = category.image.public_id.split(`${category.customId}/`)[1]
   

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADE_FOLDER}/Categories/${category.customId}`,
        public_id:spletedPublicId
      }
    );
    category.image.secure_url=secure_url;
  }

  //save data
  await category.save();

  res.status(201).json({message: 'updated successfully',data:category})
 })

 /**
 * @api (delete) /category/delete/:_id delete category
 */

const deleteCategory = catchError(async (req, res, next) => {
  const { _id } = req.params;
  //find and delete from database
  const category = await Category.findByIdAndDelete(_id);
  if (!category) return next(new AppEroor("category not found", 404));

  //delete photo and folder from cloudinary
  const categoryPath = `${process.env.UPLOADE_FOLDER}/Categories/${category.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath);
  await cloudinaryConfig().api.delete_folder(categoryPath);

  res.status(200).json({ message: "deleted successfully", data: category });
})

export { createCategory, getCategory, updateCategory, deleteCategory };