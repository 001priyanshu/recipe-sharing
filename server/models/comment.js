const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Recipe = mongoose.model("Comment", commentSchema);

module.exports = Recipe;
