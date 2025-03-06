const mongoose = require("mongoose");
const MealType = require("./mealTypeModel");

const planBundlesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    meals: {
      type: Object,
    },

    sizeRanges: [
      {
        range: { type: String },
        meal: [
          {
            name: { type: String },
            price: { type: Number, default: 0 },
            calorie: { type: String },
            size: { type: String },
          },
        ],
        isActive: { type: Boolean, default: false },
      },
    ],

    // priceRanges: [
    //   {
    //     range: { type: String },
    //     price: { type: Number, default: 0 },
    //   },
    // ],

    discounts: [
      {
        days: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
      },
    ],

    mealPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
      required: true,
    },
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
async function setMealFormMealtype(MealType) {
  const mealTypes = await MealType.find();

  const mealForm = mealTypes.reduce((acc, mealType) => {
    acc[mealType.name.toLowerCase()] = 0;
    return acc;
  }, {});

  return mealForm;
}

//middleware for the get planRanges price
planBundlesSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const MealPlan = mongoose.model("MealPlan");
      const associatedMealPlan = await MealPlan.findById(this.mealPlan);
      console.log("------>", associatedMealPlan);
      if (associatedMealPlan) {
        this.sizeRanges = associatedMealPlan.planRanges.map((range) => ({
          range: range.name,
        }));
      }
      this.meals = await setMealFormMealtype(MealType);
    } catch (error) {
      console.error("Error in PlanBundles pre-save hook:", error);
    }
  }
  next();
});

// Function to update size ranges based on meal counts
async function updateSizeRanges(planBundle) {
  // Check if the planBundle has meals
  if (!planBundle.meals) {
    throw new Error("Invalid PlanBundle object: meals are required.");
  }

  // Initialize an array to hold the size ranges
  // const sizeRanges = [];

  Object.keys(planBundle.meals).forEach((mealType) => {
    const mealCount = planBundle.meals[mealType];

    // Define the new meal object
    const newMeal = {
      name: mealType,
    };

    planBundle.sizeRanges.forEach((sizeRange) => {
      // Check if the mealType already exists in the sizeRange.meal array
      const existingMealIndex = sizeRange.meal.findIndex(
        (mealDetail) => mealDetail.name === mealType
      );

      if (mealCount > 0) {
        // If mealCount is greater than 0, add newMeal if it doesn't already exist
        if (existingMealIndex === -1) {
          sizeRange.meal.push(newMeal);
        }
      } else {
        // If mealCount is 0, remove the mealType if it exists
        if (existingMealIndex !== -1) {
          sizeRange.meal.splice(existingMealIndex, 1);
        }
      }
    });
  });

  await planBundle.save();

  return planBundle; // Return the updated planBundle
}

planBundlesSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateSizeRanges(doc);
  }
});

const PlanBundles = mongoose.model("PlanBundles", planBundlesSchema);

module.exports = PlanBundles;
