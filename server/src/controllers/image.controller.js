import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { generateGifFromImage } from "../utils/gifHelper.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import { User } from "../models/user.model.js";

const generateGif = asyncHandler(async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      throw new ApiError(400, "No image or URL provided");
    }

    const gifUrl = await generateGifFromImage(imageUrl);

    const user = await User.findById(req.user._id);
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
    throw new ApiError(500, error.message || "Error generating GIF");
  }
});

export { generateGif };
