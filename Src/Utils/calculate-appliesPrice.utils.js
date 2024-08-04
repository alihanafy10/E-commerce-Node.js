import { DiscountType } from "./index.js";

export const calculateAPPliesPrice = (price, discount) => {
    let appliedPrice=price;
     if (discount.type == DiscountType.PERCENT) {
       appliedPrice = price - (price * discount.amount) / 100;
     } else if (discount.type == DiscountType.FIXED) {
       appliedPrice = price - discount.amount;
    } 
    return appliedPrice
};