import { DateTime } from "luxon"
import { Coupon } from "../../../../Database/Model/index.js"
import { DiscountType } from "../../../Utils/index.js"
/**
 * @param {*} couponCode
 * @param {*}userId
 * @returns {message:string, error:boolean ,coupon:object}
 */


export const validateCoupon = async (couponCode, userId)=> {
    //get coupon by coupon code
    const coupon = await Coupon.findOne({ couponCode })
    if (!coupon) return { message: "Coupon not found", error: true }
    
    //check coupon is enable
    if (!coupon.isEnable) return { message: "Coupon is not enabled", error: true }
    
    //check coupon is expired
    if(DateTime.now() > DateTime.fromJSDate(coupon.to))return { message: "Coupon expired", error: true }

    //check coupon is not started
    if(DateTime.now() < DateTime.fromJSDate(coupon.from))return { message: `Coupon not started yet it starts ${coupon.from}`, error: true }

    //check if user not eligible for coupon
    const isUserNoteligible=coupon.users.findIndex(ele=>ele.userId == userId)
    if(isUserNoteligible==-1)return { message:"user not eligible for coupon",error:true };
    if (
      coupon.users[isUserNoteligible].maxCount <=
      coupon.users[isUserNoteligible].useageCount
    )return {
      message: "The number of times you have used the coupon has run out",error:true
        };
    
      return { error: false, coupon };
}





export const applyCoupon = (subTotal, coupon) => {
    let total = subTotal;
    const { couponAmount, couponType } = coupon;
  if (couponType == DiscountType.PERCENT) {
    total = subTotal - (subTotal * couponAmount) / 100;
  } else if (couponType == DiscountType.FIXED) {
      if (couponAmount > subTotal) {
          return total
      }
          total = subTotal - couponAmount;
  }
  return total;
};