import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCompass, FaUser, FaTags } from "react-icons/fa";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchPathRoute = (route) => {
    if (location.pathname === route) {
      return true;
    }
  };

  return (
    <nav className="fixed bottom-0 h-20 w-full border bg-white flex overflow-x-auto z-50 ">
      <div className="flex mx-auto gap-20 md:gap-60">
        <div
          className="flex flex-col flex-grow items-center justify-center"
          style={{ color: matchPathRoute("/") ? "#000000" : "#6b7280" }}
        >
          <FaRegCompass
            className="w-5 h-5"
            fill={matchPathRoute("/") ? "#000000" : "#6b7280"}
            onClick={() => navigate("/")}
          />
          Explore
        </div>

        <div
          className="flex flex-col flex-grow items-center justify-center "
          style={{ color: matchPathRoute("/offers") ? "#000000" : "#6b7280" }}
        >
          <FaTags
            className="w-5 h-5"
            fill={matchPathRoute("/offers") ? "#000000" : "#6b7280"}
            onClick={() => navigate("/offers")}
          />
          Offers
        </div>

        <div
          className="flex flex-col flex-grow items-center justify-center "
          style={{ color: matchPathRoute("/profile") ? "#000000" : "#6b7280" }}
        >
          <FaUser
            className="w-5 h-5"
            fill={matchPathRoute("/profile") ? "#000000" : "#6b7280"}
            onClick={() => navigate("/profile")}
          />
          Profile
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
