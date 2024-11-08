import React from "react";
import { Link } from "react-router-dom";

const Output = () => {
  return (
    <div className="output">
      <span className="output-title">Your MOTION is ready!</span>
      <div className="real-output">
        <div className="image-output">
          <span>Uploaded IMAGE :</span>
          <div className="image-output-box"></div>
        </div>
        <div className="image-output">
          <span>Generated GIF :</span>
          <div className="image-output-box"></div>
        </div>
      </div>
      <div className="download">Download GIF</div>
      <p>
        Motion is a seamless web app that turns your still photos into animated,
        lifelike GIFs. Simply upload an image or snap a selfie, and watch as
        Motion transforms it into a moving portrait with a touch of magic.
        Experience real-time GIF generation with just a click – perfect for
        sharing on social media or saving a memorable moment!
      </p>
      <div className="another">
        <Link to="/">Try another image</Link>
      </div>
    </div>
  );
};

export default Output;
