// import axios from "axios";
import { Address } from "../../../Database/Model/index.js";
import { catchError } from "../../Middleware/index.js";
import { AppEroor } from "../../Utils/index.js";

/**
 * @api (post) /address/create create new address
 */
export const createAddress = catchError(async (req, res, next) => {
    const {country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
    addressLable, setAsDefault } = req.body
  //vliadtion city
  // const citys = await axios.get(
  //   `https://api.api-ninjas.com/v1/city?country=eg&limit=30`,
  //   {
  //     headers: {
  //       "X-Api-Key": process.env.API_KEY_CITY,
  //     },
  //   }
  // );
  // console.log(citys);
  
    //convert from authUser when do auth and token
    const { userId } = req.query
    
    //todoo validation City
    const newAddress = new Address({
      userId,
      country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
      addressLable,
      isDefualt:[true, false].includes(setAsDefault)?setAsDefault:false,
    });

    if (newAddress.isDefualt) {
        await Address.updateOne({userId,isDefualt:true},{isDefualt:false})
    }

    const address = await newAddress.save()
    res.status(201).json({message:"created successfuly",address})
})

/**
 * @api (put) /address/update/:id update  address
 */

export const updateAddress = catchError(async (req, res, next) => { 
     const {
       country,
       city,
       postalCode,
       builidingNumber,
       flooreNumber,
       addressLable,
       setAsDefault,
    } = req.body;
    const { _id } = req.params
    const address = await Address.findOne({ _id, isMarkedAsDeleted :false});
    if(!address)return next(new AppEroor("address not found",404))

    if (country) address.country = country
    if (city) address.city = city
    if (postalCode) address.postalCode = postalCode
    if(builidingNumber)address.builidingNumber =builidingNumber
    if(flooreNumber) address.flooreNumber =flooreNumber
    if (addressLable) address.addressLable = addressLable
    if ([true, false].includes(setAsDefault)) {
      address.isDefualt = [true, false].includes(setAsDefault)
        ? setAsDefault
        : false;
      await Address.updateOne({ isDefualt: true }, { isDefualt: false });
    }
    await address.save()
    res.status(201).json({message: 'Address updated successfully',address})
})
/**
 * @api (Delete) /address/delete/:id delete address
 */
export const deleteAddress = catchError(async (req, res, next) => {
    const { _id } = req.params
    const address = await Address.findOneAndUpdate(
      { _id, isMarkedAsDeleted: false },
        { isMarkedAsDeleted: true, isDefualt: false },
      {new: true}
    );
    if(!address) return next(new AppEroor("address not found", 404));
    res.status(200).json({message:"address deleted successfully",address})
})


/**
 * @api (get) /address/ get all address
 */