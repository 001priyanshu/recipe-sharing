import { Routes, Route } from "react-router-dom";
import React from "react";
import NavBar from "./components/navbar/navbar";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import { Landing } from "./pages/Home/Landing";
import Recipe from "./pages/CreateRecipe/Recipe";
import FavRecipe from "./pages/CreateRecipe/FavRecipe";
import UpdateRecipe from "./components/Recipe/UpdateRecipe";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Landing />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/signin" exact element={<SignIn />} />
        <Route path="/create-recipe/" exact element={<Recipe />} />
        <Route path="/fav-recipe" exact element={<FavRecipe />} />
        <Route path="/update-recipe/:recipeId" exact element={<UpdateRecipe />} />
      </Routes>
    </div>
  );
}

export default App;
