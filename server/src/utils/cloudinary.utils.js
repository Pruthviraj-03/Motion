import fs from "fs";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "uploads",
    });

    fs.unlinkSync(imagePath);

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export { uploadToCloudinary };
