import { scheduleJob } from "node-schedule";
import { Coupon } from "../../Database/Model/index.js";
import { DateTime } from "luxon";

export const cronsJobOne = () => {
    scheduleJob("0 59 23 * * *", async()=>{
        console.log("cron job to disable coupon");
        const enableCoupons = await Coupon.find({ isEnable: true })
        console.log({
            enableCoupons: enableCoupons,
            now: DateTime.now(),
            date:DateTime.fromJSDate(enableCoupons[0]?.to)
        });
        
        if (enableCoupons) {
            for (const coupon of enableCoupons) {
                if (DateTime.now() > DateTime.fromJSDate(coupon.to)) {
                    coupon.isEnable = false;
                    await coupon.save();
                 }
            }
         }
    });
}