import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ImageUpload = ({ closeModal }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setImageUrl("");
      console.log("Selected file:", file);
    }
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    setImageUrl(url);
    if (url) {
      setFileName("");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    try {
      setLoading(true);
      const formData = new FormData();

      // Log the current state
      console.log("Submitting form...");
      console.log("File Name:", fileName);
      console.log("Image URL:", imageUrl);

      if (fileName) {
        const file = fileInputRef.current.files[0];
        if (file) {
          console.log("Appending file:", file);
          formData.append("image", file);
        } else {
          console.error("No file found in file input.");
        }
      } else if (imageUrl) {
        console.log("Appending image URL:", imageUrl);
        formData.append("imageUrl", imageUrl);
      } else {
        setErrorMessage("Please provide either a file or an image URL.");
        console.error("No file or image URL provided.");
        return;
      }

      console.log("Form Data being sent:", formData);

      const response = await axios.post(
        "http://localhost:8000/api/v2/images/generate-gif",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Response from server:", response);

      const { originalImage, gif } = response.data.data;
      console.log("Received GIF and original image:", originalImage, gif);

      navigate("/output", {
        state: { originalImage, gif },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="image-box">
        <div className="upper">
          <span>Create MOTION</span>
          <h3 onClick={closeModal}>x</h3>
        </div>
        <div
          className="middle"
          onClick={!imageUrl ? handleFileClick : undefined}
        >
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <>
              <span>Click to upload</span>
              <p>or, drag and drop</p>
            </>
          )}
        </div>
        <h5>--------- or ---------</h5>

        <input
          type="text"
          className="lower"
          placeholder="Paste an image URL!"
          value={imageUrl}
          onChange={handleUrlChange}
          disabled={!!fileName}
        />

        <input
          type="file"
          name="image"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
          disabled={!!imageUrl}
        />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="login" onClick={handleSubmit}>
          {loading ? "Processing..." : "Done"}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
