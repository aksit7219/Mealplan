const mongoose = require("mongoose");

// Ingredient Schema
const IngredientSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    rawIngredients: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawIngredient",
      default: null, // Allows for ingredients that are not sub-recipes
    },
    subRecipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      default: null, // Allows for ingredients that are not sub-recipes
    },
    isRemovable: {
      type: Boolean,
      default: false,
    },
    substitutions: [],
    customizeSize: [
      {
        name: {
          type: String,
        },
        grams: {
          type: Number,
          required: true,
          default: 0,
        },
        calorie: {
          type: Number,
          required: true,
          default: 0,
        },
        protein: {
          type: Number,
          required: true,
          default: 0,
        },
        carbs: {
          type: Number,
          required: true,
          default: 0,
        },
        fat: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    // Add fields for tracking creation and update
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      // required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to recalculate nutrition on grams change
IngredientSchema.pre("save", async function (next) {
  const ingredient = this;
  const rawIngredientsCalc = async (rawItem, grams) => {
    const item = await mongoose
      .model("RawIngredient")
      .findOne({ _id: rawItem });
    const scale = grams / 100;
    return {
      calorie: Math.round(item.calorie * scale * 100) / 100, //Math.round conver round number to remove float value
      protein: Math.round(item.protein * scale * 100) / 100,
      carbs: Math.round(item.carb * scale * 100) / 100,
      fat: Math.round(item.fat * scale * 100) / 100,
    };
  };
  const subRecipeCalc = async (item, grams) => {
    const calculateNutritionalInfo = async (rawItem, ingredientGrams) => {
      const item = await mongoose
        .model("RawIngredient")
        .findOne({ _id: rawItem });
      if (item) {
        // Raw ingredient case
        const scale = ingredientGrams / 100;
        return {
          calorie: item.calorie * scale,
          protein: item.protein * scale,
          carbs: item.carb * scale,
          fat: item.fat * scale,
        };
      } else if (item.subRecipe) {
        // Sub-recipe case
        return await subRecipeCalc(item.subRecipe, ingredientGrams);
      }
      // If neither rawIngredients nor subRecipe are present, return zeroes
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    };

    try {
      const allIngredients = await mongoose
        .model("Ingredient")
        .find({
          recipe: item,
        })
        .populate("recipe");

      let totalNutrition = { calorie: 0, protein: 0, carbs: 0, fat: 0 };
      let totalGrams = 0;
      for (const item of allIngredients) {
        const nutrition = await calculateNutritionalInfo(item, item.grams);
        totalGrams += item.grams;
        Object.keys(totalNutrition).forEach((key) => {
          totalNutrition[key] += nutrition[key];
        });
      }

      // Scale the nutrition based on the requested grams
      const scale = grams / totalGrams;
      Object.keys(totalNutrition).forEach((key) => {
        totalNutrition[key] *= scale;
        // Round to 2 decimal places
        totalNutrition[key] = Math.round(totalNutrition[key] * 100) / 100;
      });
      return totalNutrition;
    } catch (error) {
      console.error("Error calculating sub-recipe nutrition:", error);
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
  };

  if (Array.isArray(ingredient.customizeSize)) {
    const { customizeSize } = ingredient;
    if (ingredient.rawIngredients !== null) {
      for (const newSize of customizeSize) {
        const index = ingredient.customizeSize.findIndex(
          (size) => size.name === newSize.name
        );

        if (index !== -1) {
          ingredientNutrition = await rawIngredientsCalc(
            ingredient.rawIngredients,
            newSize.grams
          );
          // Update only the fields provided in the request for the matching size
          ingredient.customizeSize[index] = {
            ...ingredient.customizeSize[index]._doc, // Preserve existing fields
            ...ingredientNutrition, // Override with new values
          };
        } else {
          // Add the new size if it doesn't exist
          ingredient.customizeSize.push(newSize);
        }
      }
    } else if (ingredient.subRecipe !== null) {
      for (const newSize of customizeSize) {
        const index = ingredient.customizeSize.findIndex(
          (size) => size.name === newSize.name
        );

        if (index !== -1) {
          ingredientNutrition = await subRecipeCalc(
            ingredient.subRecipe,
            newSize.grams
          );
          console.log(ingredientNutrition);
          // Update only the fields provided in the request for the matching size
          ingredient.customizeSize[index] = {
            ...ingredient.customizeSize[index]._doc, // Preserve existing fields
            ...ingredientNutrition, // Override with new values
          };
        } else {
          // Add the new size if it doesn't exist
          ingredient.customizeSize.push(newSize);
        }
      }
    }
  }

  next();
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);
module.exports = Ingredient;
