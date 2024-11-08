import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const handleRefreshPage = () => {
    window.location.reload();
    window.scrollTo(0, 0);
  };

  return (
    <div className="header">
      <span onClick={handleRefreshPage}>
        <Link to="/">motion</Link>
      </span>
      <div className="login">login</div>
      {/* <div className="login">logout</div> */}
    </div>
  );
};

export default Header;
