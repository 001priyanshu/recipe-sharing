import React, { useState } from "react";
import "react-dropdown/style.css";
import RecipeForm from "./RecipeForm";


const CreateNew = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: [],
    imageUrl: "",
    mealType: "",
  });


  return (
    <div className="p-4 mx-auto max-w-screen-md">
      <h2 className="text-2xl font-semibold mb-4">Create Recipe</h2>
      <RecipeForm isUpdated={false} recipe={recipe} setRecipe={setRecipe}/>
    </div>
  );
};

export default CreateNew;



