import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Output from "./pages/Output";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="main">
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/output" element={<Output />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
