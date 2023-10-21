const Recipe = require("../models/recipe");
const User = require("../models//user");
const Comment = require("../models/comment");
const { use } = require("../routes/recipe");

exports.createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, instructions, imageUrl, mealType } =
      req.body;
    const user = req.user;
    const recipe = await Recipe.create({
      name,
      userId: user._id,
      ingredients,
      instructions,
      description,
      imageUrl,
      mealType,
    });

    await recipe.save();
    return res.status(200).json({
      message: "Successfully created recipe!",
      recipe,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

exports.updateRecipe = async (req, res) => {

  try {
    const { name, description, ingredients, instructions, imageUrl, mealType } =
      req.body;
    const { id } = req.params;
    const recipe = await Recipe.findById({ _id: id });
    recipe.name = name;
    recipe.description = description;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.imageUrl = imageUrl;
    recipe.mealType = mealType;

    await recipe.save();
    return res.status(200).json({
      message: "Successfully updated recipe!",
      recipe,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.findByIdAndDelete({ _id: id });
    await Comment.deleteMany({ recipeId: id });
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.favRecipes = user.favRecipes.filter((Id) => String(Id) !== String(id));
    await user.save();

    return res.status(200).json({
      message: "Successfully deleted recipe!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

exports.getAllRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 }); 
    const allRecipes = [];

    for (const item of recipes) {
      const commentsIds = item.comments;
      const comments = [];

      for (const id of commentsIds) {
        const comment = await Comment.findById(id);

        if (comment) {
          const user = await User.findById(comment.userId, { name: 1, _id: 1 });

          if (user) {
            const commentDetail = {
              content: comment.content,
              user: user,
            };
            comments.push(commentDetail);
          }
        }
      }

      const recipeWithComments = {
        ...item.toObject(),
        comments: comments,
      };

      allRecipes.push(recipeWithComments);
    }

    return res.status(200).json({
      message: "Success!",
      allRecipes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


exports.getMyRecipe = async (req, res) => {
  try {
    const user = req.user;
    const allRecipes = await Recipe.find({ userId: user._id });
    return res.status(200).json({
      message: "Success!",
      allRecipes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params; 
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json({
      message: "Success!",
      recipe,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
