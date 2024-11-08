import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/v1/users/google/callback", "_self");
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/users/logout", {
        withCredentials: true,
      });
      setUserData(null);
      alert("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/login/success",
        { withCredentials: true }
      );
      setUserData(response.data.data.user);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="header">
      <span onClick={() => navigate("/")}>
        <Link to="/">motion</Link>
      </span>
      <div
        className="login"
        onClick={userData ? handleLogout : loginWithGoogle}
      >
        {userData ? "logout" : "login"}
      </div>
    </div>
  );
};

export default Header;
