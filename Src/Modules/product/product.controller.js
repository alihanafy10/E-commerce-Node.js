import slugify from "slugify";

import { nanoid } from "nanoid";
//model
import { Product } from "../../../Database/Model/index.js";
//middleware
import { catchError } from "../../Middleware/index.js";
//utils
import { ApiFeatures, AppEroor, calculateAPPliesPrice, uploadeFile } from "../../Utils/index.js";


/**
 * @api (post) /product/create create new product
 */
const createProduct = catchError(async (req, res, next) => {
    //destruct data from body
    const { title, overview, specs, price, amount, type, stock } = req.body;
    //req.files
    if (!req.files.length) return next(new AppEroor("please uploade images", 400))
    //ids check 
    const brandData = req.document;

    /**
     * @example {size:[38,37],color:["red", "green"]}
     */

    //images
    const brandCustomId = brandData.customId;
    const subCategoryCustomId = brandData.subcategoryId.customId;
    const categoryCustomId = brandData.categoryId.customId;
    const customId=nanoid(5)
    const path = `${process.env.UPLOADE_FOLDER}/Categories/${categoryCustomId}/subCategorys/${subCategoryCustomId}/Brands/${brandCustomId}/Product/${customId}`;
    let urls=[];
    for (const file of req.files) {
        //uploade each file to cloudinary
        const { secure_url, public_id } = await uploadeFile({
          file: file.path,
          folder:path,
        });
        urls.push({ secure_url, public_id });
    }
    const newProduct = {
      title,
      overview,
      specs: JSON.parse(specs),
      price,
      appliedDiscount: {
        amount,
        type,
      },
      stock,
      images: {
        urls,
        customId,
      },
      categoryId:brandData.categoryId._id,
      subcategoryId:brandData.subcategoryId._id,
      brandId:brandData._id,
    };

    //create in db
    const data = await Product.create(newProduct);
    //send
    res.status(201).json({message:'created successfully',data})
})

/**
 * @api (put) /product/update/:_id update new product
 */
const updateProduct = catchError(async (req, res, next) => {
  //destruct product id
  const { _id } = req.params
  //destruct data from body
  const { title, stock, overview, badges, price, amount, type, specs } =
    req.body;
  const product = await Product.findById(_id)
  if (!product) return next(new AppEroor("Product not found", 404))
  if (title) {
    product.title = title
    product.slug = slugify(title, {
      replacement: "-",
      trim: true,
      lower: true,
    });
  }
  if (stock) product.stock = stock
  if (overview) product.overview = overview;
  if (badges) product.badges = badges;
  if (price || amount || type) {
    const newPrice = price || product.price
    const discount = {}
    discount.amount=amount ||product.appliedDiscount.amount;
    discount.type = type || product.appliedDiscount.type;

    product.appliedPrice = calculateAPPliesPrice(newPrice, discount);
    product.price = newPrice;
    product.appliedDiscount=discount
  }
  if (specs) product.specs = specs;
  
  await product.save()

  res.status(201).json({message:"created successfully",data:product});
})

/**
 * @api (get) /product/list list all products
 */
const listProducts = catchError(async (req, res, next) => {
  //find and pagenate all products
  // const { page = 1, limit = 3 ,...filters} = req.query
  // const skiping = (page - 1) * limit

  // const queryFilter = {}
  
  // const stringfilters = JSON.stringify(filters);
  // const replacefilters = stringfilters.replaceAll(
  //   /gt|gte|lt|lte/g,
  //   (ele) => `$${ele}`
  // );
  // const parsefilters = JSON.parse(replacefilters);
  // console.log(
  //   "filters",
  //   filters,
  //   "stringfilters",
  //   stringfilters,
  //   "replacefilters ",
  //   replacefilters,
  //   "parsefilters",
  //   parsefilters
  // );
  
  // if (price) queryFilter.price = parsePrice;
  // if (stock) queryFilter.stock = stock;
  
  // if (categoryId) queryFilter.categoryId = categoryId
  // if (subcategoryId) queryFilter.subcategoryId = subcategoryId
  // if(brandId) queryFilter.brandId = brandId
  
  // console.log(queryFilter);
  
  // const products = await Product.find().limit(limit).skip(skiping)

  // const products = await Product.paginate(parsefilters, {
  //   page,
  //   limit,
  //   skip: skiping,
  // });

  const ApiFeaturesPagination = new ApiFeatures(Product, req.query,"price")
    .filter_sort_pagination();
  
  const products = await ApiFeaturesPagination.mongooseQuery
  res.status(200).json({message:"success", products})
 })
export { createProduct, updateProduct, listProducts };