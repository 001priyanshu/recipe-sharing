import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../../hooks/useGetUserID";

const NavBar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigation = useNavigate();
  const user = useGetUserID();
  const [isSliderOpen, setSliderOpen] = useState(false);

  const handleLogOut = () => {
    setCookies("access_token", JSON.stringify(""));
    window.localStorage.removeItem("userID");
    navigation("/");
    toggleSlider();
  };

  const toggleSlider = () => {
    setSliderOpen(!isSliderOpen);
  };

  return (
    <nav className="text-blue-500 bg-black">
      <div className="nav-wrapper teal lighten-2 w-full">
        <div className="hidden md:flex w-full items-center justify-center">
          {cookies.access_token?.length > 0 ? (
            <ul className="flex">
              <li>
                <Link to="/">Recipes</Link>
              </li>
              <li>
                <Link to="/create-recipe">Create New Recipe</Link>
              </li>
              <li>
                <Link to="/fav-recipe">My Favourite</Link>
              </li>
              <li onClick={handleLogOut}>
                <Link>Log Out</Link>
              </li>
              <li className="mt-4">
                <Link>
                  <img
                    src={JSON.parse(user).avatar}
                    alt=""
                    className="w-10 h-10 rounded-full mr-4"
                  />
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex">
              <li>
                <Link to="/">Recipes</Link>
              </li>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </ul>
          )}
        </div>
        <div className="md:hidden z-10">
          <button
            onClick={toggleSlider}
            className="text-black h-16 flex justify-center items-center text-5xl font-semibold p-2"
          >
            <span>
              <div
                className={`w-6 h-1 bg-black mb-1  ${
                  isSliderOpen
                    ? "rotate-45 transition-transform"
                    : "rotate-0 transition-transform"
                } transform transition-transform`}
              ></div>
              <div
                className={`w-6 h-1 bg-black mb-1  ${
                  isSliderOpen ? "hidden" : "rotate-0 transition-transform"
                } transform transition-transform`}
              ></div>
              <div
                className={`w-6 h-1 bg-black mb-1  ${
                  isSliderOpen
                    ? "-rotate-45 -translate-y-2 transition-transform"
                    : "rotate-0 transition-transform"
                } transform transition-transform`}
              ></div>
            </span>
          </button>
        </div>
        {isSliderOpen && (
          <div className="md:hidden z-10 absolute w-screen h-screen bg-black">
            {cookies.access_token?.length > 0 ? (
              <ul className="flex flex-col">
                <li onClick={toggleSlider}>
                  <Link to="/">Recipes</Link>
                </li>
                <li onClick={toggleSlider}>
                  <Link to="/create-recipe">Create New Recipe</Link>
                </li>
                <li onClick={toggleSlider}>
                  <Link to="/fav-recipe">My Favourite</Link>
                </li>
                <li onClick={handleLogOut}>
                  <Link>Log Out</Link>
                </li>
              </ul>
            ) : (
              <ul className="flex flex-col">
                <li onClick={toggleSlider}>
                  <Link to="/">Recipes</Link>
                </li>
                <li onClick={toggleSlider}>
                  <Link to="/signin">Sign In</Link>
                </li>
                <li onClick={toggleSlider}>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
