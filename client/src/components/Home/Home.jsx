import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faBook,
  faList,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { useGetUserID } from "../../hooks/useGetUserID";
import { Link, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";


export const Home = () => {
  const [cookies] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const user = useGetUserID();
  const loggedInuserId = user ? JSON.parse(user)._id : "";
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(false);


  const navigateSignIn = () => {
    if (cookies.access_token.length === 0) {
      navigate("/signin");
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/recipe/getAllRecipes",
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setRecipes(response.data.allRecipes);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCommentsVisibility = () => {
    setCommentsVisible(!commentsVisible);
  };
  const fetchFavRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/favoriteRecipes/${loggedInuserId}`,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setFavoriteRecipes(response.data.favoriteRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchFavRecipes();
  }, []);

  const isRecipeFavorite = (id) => favoriteRecipes.includes(id);

  const toggleFavorite = async (recipeID) => {
    navigateSignIn();
    try {
      if (isRecipeFavorite(recipeID)) {
        // Remove from favorites
        await axios.put(
          `http://localhost:5000/api/user/removeFavRecipe/${recipeID}`,
          {},
          {
            headers: { Authorization: cookies.access_token },
          }
        );
        setFavoriteRecipes((prevFavorites) =>
          prevFavorites.filter((id) => id !== recipeID)
        );
      } else {
        // Add to favorites
        await axios.put(
          `http://localhost:5000/api/user/addFavRecipe/${recipeID}`,
          {},
          {
            headers: { Authorization: cookies.access_token },
          }
        );
        setFavoriteRecipes([...favoriteRecipes, recipeID]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecipe = async (recipeID) => {
    navigateSignIn();
    try {
      await axios.delete(
        `http://localhost:5000/api/recipe/deleteRecipe/${recipeID}`,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComment = async (recipeID) => {
    try {
      await axios.post(
        `http://localhost:5000/api/comment/addComment/${recipeID}`,
        {
          content: comment,
        },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      setComment("");
      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredRecipes = searchInput
    ? recipes.filter((recipe) => {
      const searchStr = searchInput.toLowerCase();
      return (
        recipe.name.toLowerCase().includes(searchStr) ||
        recipe.description.toLowerCase().includes(searchStr) ||
        recipe.mealType.toLowerCase().includes(searchStr)
      );
    })
    : recipes;

  return (
    <div className="bg-gray-100  min-h-screen p-2 ">
      <h1 className="text-center p-8 text-4xl font-serif font-extrabold my-2 text-blue-500">
        Recipes
      </h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full max-w-md"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <RotatingLines type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="space-y-8 w-full md:w-1/2  flex  flex-col  items-center">
            {filteredRecipes.map((recipe) => {
              return (
                <div
                  key={recipe._id}
                  className="bg-white p-4 shadow-lg rounded-lg w-11/12 md:w-full"
                >
                  <div className="flex justify-between mb-4">
                    {user ? (
                      <button
                        onClick={() => toggleFavorite(recipe._id)}
                        className={`px-4 py-2 text-3xl rounded ${isRecipeFavorite(recipe._id) ? "text-red-500" : "text-blue-500"
                          }`}
                      >
                        <FontAwesomeIcon className="shadow-lg hover:scale-110 transition-transform transform" icon={faHeart} />
                        <div className="flex text-xl">


                        </div>
                      </button>
                    ) : (
                      <div></div>
                    )}
                    


                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-indigo-800">
                        {recipe.name}
                      </h2>
                      <h4 className="text-xl mt-2 text-gray-700 font-bold">
                        {recipe.mealType}
                      </h4>
                    </div>

                    {user && recipe.userId === loggedInuserId ? (
                      <div>

                        <Link className="text-xl text-green-400 shadow-lg hover:scale-105 transition-transform transform" to={`/update-recipe/${recipe._id}`}>
                          <FontAwesomeIcon className="shadow-lg hover:scale-110 transition-transform transform" icon={faPen} />
                        </Link>

                        <button
                          onClick={() => deleteRecipe(recipe._id)}
                          className="px-4 py-2 text-2xl text-red-500 rounded "
                        >
                          <FontAwesomeIcon className="shadow-lg hover:scale-110 transition-transform transform" icon={faTrash} />
                        </button>
                      </div>

                    ) : (
                      <div></div>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700 text-center">
                    {recipe.description}
                  </p>

                  <hr className="my-4 border-t border-gray-300" />
                  <div>
                    <div className=" flex">
                      <FontAwesomeIcon
                        icon={faList}
                        className="text-indigo-500 text-xl w-max"
                      />
                      <h3 className="text-xl -mt-1 ml-2 font-semibold text-indigo-800">
                        Ingredients
                      </h3>
                    </div>
                    <ul className="pl-4 text-gray-700">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-lg">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr className="my-4 border-t border-gray-300" />
                  <div>
                    <div className="flex">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="text-indigo-500 text-xl"
                      />
                      <h3 className="text-lg -mt-1 ml-2 font-semibold text-indigo-800">
                        Instructions
                      </h3>
                    </div>
                    <ul className="pl-4 text-gray-700">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-lg">
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="mt-4 w-full h-96 object-cover rounded"
                  />

                  {user ? (
                    <div className="mt-4">
                      <textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      />
                      <button
                        onClick={() => handleAddComment(recipe._id)}
                        className="bg-blue-500 text-white p-2 rounded-md mt-2"
                      >
                        Add Comment
                      </button>
                    </div>
                  ) : null}

                  {recipe.comments.length > 0 && (
                    <div className="mt-4 text-gray-800 -mt-8 mb-4  text-right">

                      <button
                        onClick={() => toggleCommentsVisibility(recipe._id)}
                        className="text-md text-right  text-black rounded-md bg-gray-400 p-1 font-bold shadow-lg hover:scale-105 transition-transform transform"
                      >
                        {commentsVisible ? "Hide Comments" : "Show Comments"}
                      </button>
                    </div>
                  )}

                  {commentsVisible && recipe.comments.length > 0 && (
                    recipe.comments.map((ele, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 border p-4 my-4 rounded-lg"
                      >
                        <div className="font-semibold text-black">
                          {ele.user.name}
                        </div>
                        <div className="text-gray-700">{ele.content}</div>
                      </div>
                    ))
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};
