import multer from "multer";
import { AppEroor, extentions } from "../Utils/index.js";

export const fileUpload = (allowedExtensions = extentions.Images) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (allowedExtensions.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new AppEroor(
        `error`,
        400,
        `Invalid file type, only ${allowedExtensions} images are allowed`
      ),
      false
    );
  };
  const upload = multer({
    storage,
    fileFilter,
  });

  return upload;
};
