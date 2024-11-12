import axios from "axios";
import fs from "fs";
import path from "path";

function imageFileToBase64(imagePath) {
  const imageData = fs.readFileSync(path.resolve(imagePath));
  return Buffer.from(imageData).toString("base64");
}

async function imageUrlToBase64(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary").toString("base64");
}

const api_key = process.env.SEGMIND_API_KEY;
const url = "https://api.segmind.com/v1/live-portrait";

const generateGifFromImage = async (imageUrl) => {
  const data = {
    face_image: await imageUrlToBase64(imageUrl),
    driving_video:
      "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-video.mp4",
    live_portrait_dsize: 512,
    live_portrait_scale: 2.3,
    video_frame_load_cap: 128,
    live_portrait_lip_zero: true,
    live_portrait_relative: true,
    live_portrait_vx_ratio: 0,
    live_portrait_vy_ratio: -0.12,
    live_portrait_stitching: true,
    video_select_every_n_frames: 1,
    live_portrait_eye_retargeting: false,
    live_portrait_lip_retargeting: false,
    live_portrait_lip_retargeting_multiplier: 1,
    live_portrait_eyes_retargeting_multiplier: 1,
  };

  try {
    const response = await axios.post(url, data, {
      headers: { "x-api-key": api_key },
    });

    if (response.data.error === "Insufficient credits") {
      throw new Error(
        "Insufficient credits. Please add credits to your account."
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error generating GIF:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate GIF");
  }
};

(async () => {
  try {
    const gifData = await generateGifFromImage(
      "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-input.jpg"
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
})();

export { generateGifFromImage };
