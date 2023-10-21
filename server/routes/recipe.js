const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipe,
  getMyRecipe,
  getRecipeById
} = require("../controllers/recipe");

router.post("/createRecipe", authentication, createRecipe);
router.put("/updateRecipe/:id", authentication, updateRecipe);
router.delete("/deleteRecipe/:id", authentication, deleteRecipe);
router.get("/getAllRecipes", getAllRecipe);
router.get("/getMyRecipes", authentication, getMyRecipe);
router.get("/getRecipe/:id", authentication, getRecipeById);

module.exports = router;
