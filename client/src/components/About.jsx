import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

const About = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="about">
      <span>Bring Your Photos to Life – Generate a GIF in Seconds!</span>
      <p>
        Motion is a seamless web app that turns your still photos into animated,
        lifelike GIFs. Simply upload an image or snap a selfie, and watch as
        Motion transforms it into a moving portrait with a touch of magic.
        Experience real-time GIF generation with just a click – perfect for
        sharing on social media or saving a memorable moment!
      </p>
      <div className="upload" onClick={openModal}>
        Get Started
      </div>

      {showModal && <ImageUpload closeModal={closeModal} />}
    </div>
  );
};

export default About;
