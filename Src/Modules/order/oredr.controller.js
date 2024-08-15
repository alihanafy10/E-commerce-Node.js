import { DateTime } from "luxon";
import { Address, Cart, Orders } from "../../../Database/Model/index.js";
import { catchError } from "../../Middleware/index.js";
import { AppEroor, orderStatusType, paymentMethodType } from "../../Utils/index.js";
import { calculateCartTotale } from "../cart/utils/cart.utils.js";
import { applyCoupon, validateCoupon } from "./utils/index.js";

/**
 * @api (post) /order/create create new order
 */
export const createOrder = catchError(async (req, res, next) => {
  const { userId } = req.query;
  const {
    address,
    addressId,
    contactNumber,
    shippingFee,
    VAT,
    couponCode,
    paymentMethod,
  } = req.body;
  //check usre has already cart
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart || !cart.products.length)
    return next(new AppEroor("Empty cart", 400));

  //check if any product is sold out
  const isSoldOut = cart.products.find((p) => p.productId.stock < p.quantity);
  if (isSoldOut)
    return next(
      new AppEroor(`product ${isSoldOut.productId.title} is sold out`, 404)
    );

  const subTotal = calculateCartTotale(cart.products);
  let total = subTotal + shippingFee + VAT;

  let coupon = null;
  if (couponCode) {
    const isCouponValid = await validateCoupon(couponCode, userId);

    if (isCouponValid.error) {
      return next(new AppEroor(isCouponValid.message, 400));
    }
    coupon = isCouponValid.coupon;
    total = applyCoupon(subTotal, isCouponValid.coupon) +shippingFee + VAT;
  }

  if (!address && !addressId)
    return next(new AppEroor("address required", 400));
  if (addressId) {
    const addressInfo = await Address.findOne({ _id: addressId, userId });
    if (!addressInfo) return next(new AppEroor("invalid address", 400));
  }

  let orderStatus = orderStatusType.PENDING;
  if (paymentMethod == paymentMethodType.CASH)
    orderStatus = orderStatusType.PLACED;

  const orderObj = new Orders({
    address,
    addressId,
    products: cart.products,
    userId,
    contactNumber,
    subTotal,
    shippingFee,
    VAT,
    total,
    couponId: coupon?._id,
    paymentMethod,
    orderStatus,
    estimatedDeliveryDate:DateTime.now().plus({days:7}).toFormat("yyyy-MM-dd"),
  });
  await orderObj.save();

  //remove cart
  cart.products = [];
  await cart.save()
  //decrement stock
  //increment useageCount

  res.status(201).json({message: 'created successfully',order:orderObj})
})
