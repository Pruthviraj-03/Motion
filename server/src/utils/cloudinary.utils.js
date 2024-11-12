import fs from "fs";
import cloudinary from "cloudinary";
import { fileTypeFromBuffer } from "file-type";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const fileTypeResult = await fileTypeFromBuffer(buffer);
    console.log("File Type:", fileTypeResult);

    let resourceType = "image";

    const allowedImageTypes = ["gif", "jpg", "jpeg", "png"];
    const allowedVideoTypes = ["mp4", "mov", "avi"];

    if (fileTypeResult && allowedImageTypes.includes(fileTypeResult.ext)) {
      resourceType = "image";
    } else if (
      fileTypeResult &&
      allowedVideoTypes.includes(fileTypeResult.ext)
    ) {
      resourceType = "video";
    } else {
      throw new Error(
        "Invalid file type, expected one of: GIF, JPG, JPEG, PNG, MP4."
      );
    }

    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "uploads",
      resource_type: resourceType,
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (error.http_code === 400) {
      console.error("Possible video format issue. Please check the file.");
    }
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export { uploadToCloudinary };
