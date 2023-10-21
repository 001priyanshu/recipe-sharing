const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const {
  login,
  register,
  addFavRecipe,
  removeFavRecipe,
  getFavoriteRecipes,
} = require("../controllers/user");

router.post("/signin", login);
router.post("/signup", register);
router.put("/addFavRecipe/:id", authentication, addFavRecipe);
router.put("/removeFavRecipe/:id", authentication, removeFavRecipe);
router.get("/favoriteRecipes/:id", authentication, getFavoriteRecipes);

module.exports = router;
