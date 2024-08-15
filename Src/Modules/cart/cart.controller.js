import {Cart, Product } from "../../../Database/Model/index.js";
import { catchError } from "../../Middleware/index.js";
import { AppEroor } from "../../Utils/index.js";

/**
 * @api (post) /cart/add/:productId create new cart
 */
export const AddToCart = catchError(async (req, res, next) => {
    const { userId } = req.query
    const { quantity } = req.body
    const { productId } = req.params
    const product = await Product.findOne({ _id: productId, stock :{$gte: quantity}});
    if (!product) return next(new AppEroor("product not found", 404))
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        const newCart = new Cart({
          userId,
          products: [
            { productId: product._id, quantity, price: product.appliedPrice },
            ],
        });
        await newCart.save()
        res.status(201).json({message:"Cart saved successfully",cart:newCart})
    }
    const isProductExist = cart.products.find(p => p.productId == productId)
    if(isProductExist) return next(new AppEroor("product already exists", 404))
        cart.products.push({
          productId: product._id,
          quantity,
          price: product.appliedPrice,
        });
    await cart.save()
    res.status(200).json({ message: "Cart saved successfully", cart });
})

/**
 * @api (delete) /cart/remove/:id remove  cart
 */
export const removeForCart = catchError(async (req, res, next) => {
    const { userId } =req.query
    const { productId } = req.params
    const cart = await Cart.findOne({ userId, 'products.productId': productId })
    if(!cart)return next(new AppEroor("product not in cart",404))
        cart.products = cart.products.filter(p=>p.productId != productId);
  
  await cart.save()
  cart.products.length
    ? res.status(200).json({ message: "deleted succsses", cart })
    : res.status(200).json({ message: "deleted succsses" });
  
})


/**
 * @api (put) /cart/update/:productId  update cart
 */
export const updateCart = catchError(async (req, res, next) => {
  const { userId } = req.query;
  const { productId } = req.params;
  const { quantity } = req.body

  const isStokless=await Product.findOne({_id:productId,stock:{$gte:quantity}})
  if (!isStokless) return next(new AppEroor("product not avilable for this quantity", 404))

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) return next(new AppEroor("product not in cart", 404));
  
  const idxproduct = cart.products.findIndex(p => p.productId == productId);
  cart.products[idxproduct].quantity=quantity;
  await cart.save()
  res.status(201).json({message:"updated successfully",cart})
 })
/**
 * @api (get) /cart/ get all cart
 */
