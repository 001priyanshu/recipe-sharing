import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "react-dropdown/style.css";
import RecipeForm from "./RecipeForm";


const UpdateRecipe = () => {

    const { recipeId } = useParams();
    const [cookies] = useCookies(["access_token"]);

    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        ingredients: [],
        instructions: [],
        imageUrl: "",
        mealType: "",
    });


    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/recipe/getRecipe/${recipeId}`, {
                headers: { authorization: cookies.access_token },
            })
            .then((response) => {
               
                const existingRecipe = response.data.recipe;
                setRecipe({
                    ...existingRecipe,
                    mealType: existingRecipe.mealType,
                    imageUrl:existingRecipe.imageUrl
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [recipeId, cookies.access_token]);


    return (
        <div className="p-4 mx-auto max-w-screen-md">
            <h2 className="text-2xl font-semibold mb-4">Update Recipe</h2>
            <RecipeForm isUpdated={true} recipe={recipe} setRecipe={setRecipe} />
        </div>

    );
};

export default UpdateRecipe;



