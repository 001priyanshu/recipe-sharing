import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { storage } from "../firebase/firebase.init";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const options = ["lunch", "dinner", "supper", "breakfast", "desert"];

const CreateNew = () => {
  const [cookies] = useCookies(["access_token"]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: [],
    imageUrl: "",
    mealType: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const selectedFile = event.target.files && event.target.files[0];

    setRecipe({ ...recipe, [name]: name === "photo" ? selectedFile : value });
    setSelectedImage(selectedFile);
  };
  const handleRecipeType = (selectedOption) => {
    const newMealType = selectedOption.value;

    setRecipe({ ...recipe, mealType: newMealType });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };
  const handleRemoveIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients });
  };
  const handleInstructionChange = (event, index) => {
    const { value } = event.target;
    const instructions = [...recipe.instructions];
    instructions[index] = value;
    setRecipe({ ...recipe, instructions });
  };
  const handleAddInstruction = () => {
    const instructions = [...recipe.instructions, ""];
    setRecipe({ ...recipe, instructions });
  };
  const handleRemoveInstruction = (index) => {
    const instructions = [...recipe.instructions];
    instructions.splice(index, 1);
    setRecipe({ ...recipe, instructions });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (selectedImage) {
        const imageRef = ref(storage, `images/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        const url = await getDownloadURL(imageRef);

        await axios.post(
          "http://localhost:5000/api/recipe/createRecipe",
          { ...recipe, imageUrl: url },
          {
            headers: { authorization: cookies.access_token },
          }
        );

        alert("Recipe Created");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-screen-md">
      <h2 className="text-2xl font-semibold mb-4">Create Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium">
            Ingredients
          </label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="px-2 py-1 text-red-600 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Ingredient
          </button>
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium">
            Instructions
          </label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                name="instructions"
                value={instruction}
                onChange={(event) => handleInstructionChange(event, index)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveInstruction(index)}
                className="px-2 py-1 text-red-600 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddInstruction}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Instruction
          </button>
        </div>
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium">
            Meal Type
          </label>
          <Dropdown
            options={options}
            onChange={handleRecipeType}
            value={recipe.mealType}
            placeholder="Select an option"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image
          </label>
          <div className="relative border border-dashed border-gray-300 p-4 rounded-md">
            {!selectedImage && (
              <input
                type="file"
                accept="image/*"
                name="photo"
                className="absolute top-0 left-0 h-full w-full opacity-0"
                onChange={handleChange}
              />
            )}
            {selectedImage ? (
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="ml-2 text-green-600 font-semibold">
                  Image selected
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <p className="ml-2 text-gray-400">Select an image</p>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
