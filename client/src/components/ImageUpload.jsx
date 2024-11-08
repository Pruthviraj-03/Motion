import React, { useRef, useState } from "react";

const ImageUpload = ({ closeModal }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
          disabled={!!imageUrl}
        />

        <div className="login">done</div>
      </div>
    </div>
  );
};

export default ImageUpload;
