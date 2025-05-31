import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-red-400 via-pink-500 to-orange-400 shadow-md text-white py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          🍽️ CookNest
        </Link>
        <div className="flex gap-x-3 items-center">
          {user ? (
            <>
              <Link to="/add-recipe">
                <button className="bg-white text-pink-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
                  Add Recipe
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-pink-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white text-pink-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-white text-pink-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
