import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { generateGifFromImage } from "../utils/gifHelper.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import { User } from "../models/user.model.js";

const generateGif = asyncHandler(async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
      console.log("Image uploaded to Cloudinary. URL:", imageUrl);
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
      console.log("Image URL:", imageUrl);
    } else {
      throw new ApiError(400, "No image or URL provided");
    }

    const gifUrl = await generateGifFromImage(imageUrl);

    console.log("Generated GIF URL:", gifUrl);

    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    user.mygifs.push({
      originalImage: imageUrl,
      gif: gifUrl,
    });

    await user.save();

    res.json(
      new ApiResponse(
        200,
        { originalImage: imageUrl, gif: gifUrl },
        "GIF generated and saved successfully"
      )
    );
  } catch (error) {
    console.error("Error in generateGif:", error);
    throw new ApiError(500, error.message || "Error generating GIF");
  }
});

export { generateGif };
