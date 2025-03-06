const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    startingPrice: {
      type: Number,
    },
    caption: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    shortBrief: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    planRanges: [
      {
        name: { type: String, unique: true },
        calories: { type: String },
        description: { type: String },
        forWeb: { type: Boolean, default: false },
      },
    ],
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
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true }
);

// Middleware for update priceRanges at the planBundle
async function updatePlanBundles(mealPlan) {
  try {
    const PlanBundles = mongoose.model("PlanBundles");
    const planBundles = await PlanBundles.find({ mealPlan: mealPlan._id });

    // for (let planBundle of planBundles) {
    //   const newPriceRanges = mealPlan.planRanges.map((range) => {
    //     const existingRange = planBundle.sizeRanges.find(
    //       (pr) => pr.range === range.name
    //     );
    //     return {
    //       range: range.name,
    //       // price: existingRange ? existingRange.price : 0, // Keep existing price if available, otherwise set to 0
    //     };
    //   });

    //   planBundle.sizeRanges = newPriceRanges;
    //   await planBundle.save();
    // }

    // const newPriceRanges = mealPlan.planRanges.map((range) => range.name);
    for (let planBundle of planBundles) {
      // Extract the range names from mealPlan.planRanges
      const validRangeNames = mealPlan.planRanges.map((range) => range.name);

      // Filter out sizeRanges that no longer exist in mealPlan.planRanges
      planBundle.sizeRanges = planBundle.sizeRanges.filter((sizeRange) =>
        validRangeNames.includes(sizeRange.range)
      );

      // Add new ranges from mealPlan.planRanges
      const existingRangeNames = planBundle.sizeRanges.map((pr) => pr.range);
      const newRanges = mealPlan.planRanges
        .filter((range) => !existingRangeNames.includes(range.name)) // Find new ranges
        .map((range) => ({
          range: range.name,
        }));

      // Merge existing sizeRanges with the new ones
      planBundle.sizeRanges = [...planBundle.sizeRanges, ...newRanges];

      // Save the updated planBundle
      await planBundle.save();
    }
  } catch (error) {
    console.error("Error updating PlanBundles:", error);
  }
}

mealPlanSchema.post("save", async function (doc) {
  await updatePlanBundles(doc);
});

mealPlanSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updatePlanBundles(doc);
  }
});
mealPlanSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updatePlanBundles(doc);
  }
});

//Middleware for delete related bundle when delete mealplan

const deleteMealPlanAndRelatedData = async (mealPlanId) => {
  try {
    // 1. Delete the meal plan
    await MealPlan.findByIdAndDelete(mealPlanId);

    // 2. Delete all related plan bundles where the mealPlan field matches
    await PlanBundle.deleteMany({ mealPlan: mealPlanId });

    // Optionally delete related data in other collections
    // await OtherCollection.deleteMany({ mealPlan: mealPlanId });

    console.log(`MealPlan and related data deleted successfully.`);
  } catch (error) {
    console.error("Error deleting meal plan and related data:", error);
  }
};

mealPlanSchema.deleteMealPlanAndRelatedData;

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

module.exports = MealPlan;
