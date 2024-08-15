import { Coupon, Couponlogs, User } from "../../../Database/Model/index.js";
import { catchError } from "../../Middleware/index.js";
import { AppEroor } from "../../Utils/index.js";
/**
 * @api (post) /coupon/create create new coupon
 */
export const createCoupon = catchError(async (req, res, next) => {
    const { couponCode, couponAmount, couponType, from, to, users } = req.body
    //coupon code check
    const isCouponCodeExist = await Coupon.findOne({ couponCode })
    if(isCouponCodeExist) return next(new AppEroor("coupone code already exists",404))
    //users check
    const userIds=users.map(e=>e.userId)
    const validUsers = await User.find({ _id: { $in: userIds } })
    if(userIds.length!=validUsers.length) return next(new AppEroor("Invalid users",404))

    const newCoupon = new Coupon({
      couponCode,
      couponAmount,
      couponType,
      from,
      to,
      users,
      createdBy: req.query.createdBy,
    });

    await newCoupon.save()
    res.status(201).json({message:'coupon created successfully',coupon:newCoupon})
});

/**
 * @api (get) /coupon/ get all coupon
 */
export const getAllCoupons = catchError(async (req, res, next) => {
  const { isEnable } = req.query
  const filters = {}
  if (isEnable) filters.isEnable = (isEnable == 'true') ? true : false
  const coupons = await Coupon.find(filters)
  res.status(200).json({message:'success', coupons})
})

/**
 * @api (get) /coupon/:_id get coupon by id
 */
export const getCoupon = catchError(async (req, res, next) => {
  const { _id } = req.params;
  const coupon = await Coupon.findById(_id)
  if (!coupon) return next(new AppEroor('coupon not found', 404))
  res.status(200).json({message:'success', coupon})
})

/**
 * @api (update) /coupon/update/:_id update coupon
 */
export const updateCoupon = catchError(async (req, res, next) => {
  const { _id } = req.params
  const { userId } = req.query
  const { couponCode, couponAmount, couponType, from, to, users } = req.body;
  //check coupon
  const coupon = await Coupon.findById(_id)
  if (!coupon) return next(new AppEroor("coupon not found", 404))
  //obj logs
  const logsCoupon = { couponId: _id, createdBy: userId, changes :{}};

  if (couponCode) {
    const isCouponCodeExist = await Coupon.findOne({ couponCode });
    if(isCouponCodeExist) return next(new AppEroor("coupon already exists",404))
    coupon.couponCode = couponCode
    logsCoupon.changes.couponCode=couponCode
  }
  if (from) {
    coupon.from = from
    logsCoupon.changes.from=from
  }
  if (to) {
    coupon.to = to
    logsCoupon.changes.to=to
  }
  if (couponAmount) {
    coupon.couponAmount = couponAmount;
    logsCoupon.changes.couponAmount=couponAmount
  }
  if (couponType) {
    coupon.couponType = couponType
    logsCoupon.changes.couponType=couponType
  }
  if (users) {
    //users check
    const userIds = users.map((e) => e.userId);
    const validUsers = await User.find({ _id: { $in: userIds } });
    if (userIds.length != validUsers.length)
      return next(new AppEroor("Invalid users", 404));
    coupon.users = users
    logsCoupon.changes.users=users
  }

  await coupon.save()
  const logs = await new Couponlogs(logsCoupon).save(); 

  res.status(201).json({message:'updated successfully',coupon,logs})
 })

/**
 * @api (patch) /coupon/update/:_id update enable or disable coupon
 */
export const enableCoupon = catchError(async (req, res, next) => {
    const { _id } = req.params;
    const { userId } = req.query;
    const { enable } = req.body;
    //check coupon
    const coupon = await Coupon.findById(_id);
    if (!coupon) return next(new AppEroor("coupon not found", 404));
    //obj logs
    const logsCoupon = { couponId: _id, createdBy: userId, changes: {} };
  if (enable === true) {
    coupon.isEnable = true;
    logsCoupon.changes.isEnable = true;
  }
  if (enable === false) {
    coupon.isEnable = false;
    logsCoupon.changes.isEnable = false;
  }
   await coupon.save();
   const logs = await new Couponlogs(logsCoupon).save();

   res.status(201).json({ message: "updated successfully", coupon, logs });
})