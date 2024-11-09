import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { generateGifFromImage } from "../utils/gifHelper.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";

// Function to convert the binary GIF data into a temporary file
const saveBinaryGifToFile = (gifData) => {
  // Use __dirname to get the current directory and join it with 'temp' to form a proper path
  const tempDir = path.resolve(process.cwd(), "temp");

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(tempDir)) {
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("Directory created:", tempDir);
    } catch (err) {
      console.error("Error creating directory:", err);
      throw new ApiError(500, "Failed to create temporary directory");
    }
  }

  // Define the file path for the GIF
  const gifPath = path.join(tempDir, "tempGif.gif");

  try {
    // Write the binary GIF data to the temporary file
    fs.writeFileSync(gifPath, gifData, "binary");
    console.log("GIF saved to temporary file:", gifPath);
  } catch (error) {
    console.error("Error saving GIF to file:", error);
    throw new ApiError(500, "Failed to save GIF to file");
  }

  return gifPath;
};

const generateGif = asyncHandler(async (req, res) => {
  try {
    let imageUrl = null;

    // Upload image to Cloudinary if provided in the request
    if (req.file) {
      console.log("Uploading image from file...");
      imageUrl = await uploadToCloudinary(req.file.path);
      console.log("Image uploaded to Cloudinary:", imageUrl);
    } else if (req.body.imageUrl) {
      console.log("Using provided image URL:", req.body.imageUrl);
      imageUrl = req.body.imageUrl;
    } else {
      throw new ApiError(400, "No image or URL provided");
    }

    // Generate GIF from image
    console.log("Generating GIF from image...");
    const gifData = await generateGifFromImage(imageUrl);
    console.log("GIF generated successfully");

    // Save the binary GIF data to a temporary file
    const gifPath = saveBinaryGifToFile(gifData);

    // Upload the GIF to Cloudinary
    console.log("Uploading GIF to Cloudinary...");
    const gifUrl = await uploadToCloudinary(gifPath);
    console.log("GIF uploaded to Cloudinary:", gifUrl);

    // Remove the temporary GIF file after upload
    fs.unlinkSync(gifPath);
    console.log("Temporary GIF file removed");

    // Find the user and update their record with the generated GIF URL
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    console.log("User found, updating with new GIF...");
    user.mygifs.push({ originalImage: imageUrl, gif: gifUrl });
    await user.save();
    console.log("User record updated with new GIF");

    // Send response with the original image and generated GIF URLs
    res.json(
      new ApiResponse(
        200,
        { originalImage: imageUrl, gif: gifUrl },
        "GIF generated and saved successfully"
      )
    );
  } catch (error) {
    console.error("Error in generateGif function:", error);
    throw new ApiError(500, error.message || "Error generating GIF");
  }
});

export { generateGif };
