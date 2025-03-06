const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    description_arabic: {
      type: String,
    },

    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealType",
      default: null,
    },
    cuisine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CusineType",
      default: null,
    },
    category: {
      type: String,
    },
    dietType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietType",
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    validity: {
      type: String,
    },
    tags: {
      type: [String],
    },
    image: {
      type: [String],
    },
    sizes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sizes",
          default: null,
        },
      ],
    },
    mealType: {
      Breakfast: {
        type: Boolean,
        default: false,
      },
      Lunch: {
        type: Boolean,
        default: false,
      },
      Dinner: {
        type: Boolean,
        default: false,
      },
    },
    servingDetails: {
      description: { type: String },
      yield: { type: Number },
      numberOfServings: { type: Number },
      totalGrams: { type: Number },
      gramsPerServing: { type: Number },
    },
    instructions: {
      type: [String],
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        default: null,
      },
    ],
    costPerServing: {
      type: Number,
      default: 0,
    },
    kitchenSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KitchenSectionCategorie",
      default: null,
    },
    label: {
      type: [String],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // Add fields for tracking creation and update
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to set createdBy and updatedBy
RecipeSchema.pre("save", function (next) {
  // Only set createdBy on new documents
  if (this.isNew) {
    // Assuming you're passing the user ID through the context
    if (!this.createdBy && this.context && this.context.user) {
      this.createdBy = this.context.user._id;
    }
  } else {
    // For updates, set updatedBy
    if (this.context && this.context.user) {
      this.updatedBy = this.context.user._id;
    }
  }
  next();
});

// Middleware for findOneAndUpdate to set updatedBy
RecipeSchema.pre("findOneAndUpdate", function (next) {
  // Add updatedBy to the update operation
  if (this.context && this.context.user) {
    this.getUpdate().$set = this.getUpdate().$set || {};
    this.getUpdate().$set.updatedBy = this.context.user._id;
  }
  next();
});
const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
