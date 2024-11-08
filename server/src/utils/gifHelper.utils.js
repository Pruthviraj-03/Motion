import axios from "axios";

const SEGMENT_API_URL = "https://api.segmind.com/your-endpoint";
const API_KEY = process.env.SEGMIND_API_KEY;

const generateGifFromImage = async (imageInput) => {
  try {
    const response = await axios.post(
      SEGMENT_API_URL,
      { image: imageInput },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    if (response.data && response.data.gifUrl) {
      return response.data.gifUrl;
    } else {
      throw new Error("GIF URL not found in response");
    }
  } catch (error) {
    console.error("Error generating GIF:", error);
    throw new Error("Failed to generate GIF from image");
  }
};

export { generateGifFromImage };
