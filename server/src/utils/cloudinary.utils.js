import fs from "fs";
import cloudinary from "cloudinary";
import { fileTypeFromBuffer } from "file-type"; // Corrected import for newer versions

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    // Read the file into a buffer
    const buffer = fs.readFileSync(filePath);

    // Use fileTypeFromBuffer to detect the file type from the buffer
    const fileTypeResult = await fileTypeFromBuffer(buffer); // Await the async call for buffer
    console.log("File Type:", fileTypeResult); // Log file type for debugging

    // Initialize the resource_type variable to default to 'image'
    let resourceType = "image"; // Default resource type is 'image'

    // Define allowed file types for both image and video formats
    const allowedImageTypes = ["gif", "jpg", "jpeg", "png"];
    const allowedVideoTypes = ["mp4", "mov", "avi"];

    // Check if the file type is an allowed image
    if (fileTypeResult && allowedImageTypes.includes(fileTypeResult.ext)) {
      resourceType = "image"; // Image file, continue with image upload
    }
    // Check if the file type is an allowed video
    else if (fileTypeResult && allowedVideoTypes.includes(fileTypeResult.ext)) {
      resourceType = "video"; // Video file, set resource type to video
    }
    // If file type is not allowed, throw an error
    else {
      throw new Error(
        "Invalid file type, expected one of: GIF, JPG, JPEG, PNG, MP4."
      );
    }

    // Upload the file (image or video) to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "uploads", // Specify folder for organization in Cloudinary
      resource_type: resourceType, // Pass the resource_type here correctly
      // Remove eager transformations for now to test direct upload
    });

    // Remove the temp file after upload
    fs.unlinkSync(filePath);

    // Return the URL of the uploaded file
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (error.http_code === 400) {
      // Provide more info on the error if it's related to the format
      console.error("Possible video format issue. Please check the file.");
    }
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export { uploadToCloudinary };
