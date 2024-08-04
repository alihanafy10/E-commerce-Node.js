import { v2 as cloudinary } from "cloudinary";
import { AppEroor } from "./index.js";

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET, // Click 'View Credentials' below to copy your API secret
  });
  return cloudinary;
};

/**
 * @param {file} file
 * @param {string} folder
 * @param {object}
 * @description uploades a file to cloudinary
 */

export const uploadeFile = async ({ file, folder = "General", publicId }) => {
  if (!file) {
    return next (new AppEroor("Please uploade an image",404))
  }

  let options = { folder }
  if (publicId) { 
    options.public_id =publicId
  }

  const { secure_url, public_id }=await cloudinaryConfig().uploader.upload(
    file, options
  )
  return { secure_url, public_id };
}