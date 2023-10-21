const Comment = require("../models/comment");
const Recipe = require("../models/recipe");

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.create({
      userId: req.user._id,
      recipeId: id,
      content,
    });
    const recipe = await Recipe.findById({ _id: id });
    recipe.comments.push(comment._id);
    await recipe.save();
    return res.status(200).json({
      message: "Successfull",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
