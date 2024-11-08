import React from "react";

const ImageUpload = () => {
  return (
    <div className="image-box">
      <div className="upper">
        <span>Create MOTION</span>
        <h3>x</h3>
      </div>
      <div className="middle">
        <span>Click to upload</span>
        <p>or, drag and drop</p>
      </div>
      <h5>--------- or ---------</h5>
      <input
        type="text"
        className="lower"
        placeholder="Paste an image URL!"
      ></input>
      <div className="login">done</div>
    </div>
  );
};

export default ImageUpload;
