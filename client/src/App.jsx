import React from "react";
import Header from "./components/Header";
import About from "./components/About";
import ImageUpload from "./components/ImageUpload";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import Output from "./components/Output";

const App = () => {
  return (
    <div className="main">
      <Header />
      {/* <About />
      <ImageUpload />
      <Demo />
      <Footer /> */}
      <Output />
    </div>
  );
};

export default App;
