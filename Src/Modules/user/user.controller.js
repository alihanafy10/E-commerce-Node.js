
import { hashSync } from "bcrypt";

import { Address, User } from "../../../Database/Model/index.js";
import { catchError } from "../../Middleware/index.js";
import { AppEroor } from "../../Utils/index.js";

/**
 * @api (post) /users/register registration a new user
 */
const registration = catchError(async (req, res, next) => {
    const {
      userName,
      email,
      password,
      gender,
      age,
      phone,
      userType,
      country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
      addressLable,
    } = req.body;

    //email check
    const isEmailExist = await User.findOne({ email });
    if(isEmailExist)return next(new AppEroor("email already exist",400))

    //todo send mail

    //create user object
    const userObj = { userName, email, password, gender, age, phone, userType };
    //create user in db
    const newUser = await User.create(userObj)
    //create address obj
    const addressObj = {
      userId: newUser._id,
      country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
      addressLable,
      isDefualt:true,
    };
    //create address in db
    const newaddress=await Address.create(addressObj);
    //send the res
    res.status(201).json({message:"rejistration successfully",data:newUser,Address:newaddress});
})
 

const updateAcc = catchError(async (req, res, next) => {
    const { id } = req.params
    const { password } = req.body
    
    const user = await User.findById(id)
    if(!user)return next(new AppEroor("user not found", 404));

    if(password)user.password =password

    await user.save()

    res
      .status(201)
      .json({ message: "updated successfully", data: user });
 })
export { registration, updateAcc };