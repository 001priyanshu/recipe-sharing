const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ingredients: [
      {
        type: String,
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    imageUrl: String,
    description: String,
  },
  
  {
    timestamps: true,
  }
);
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
