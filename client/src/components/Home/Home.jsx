import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import RecipeCard from "../Recipe/RecipeCard";


export const Home = () => {
  const [cookies] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const user = useGetUserID();
  const loggedInuserId = user ? JSON.parse(user)._id : "";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


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
                  return(

                    <RecipeCard recipe={recipe} fetchRecipes={fetchRecipes}  fetchFavRecipes={fetchFavRecipes}  setRecipes={setRecipes} favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />
                  )
                    })}
                </div>
            </div>
       
       
      )}
    </div>
  );
};
