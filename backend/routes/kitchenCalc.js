const MenuItems = require("../models/menuItemsModel");
const PlanBundles = require("../models/planBundlesModel");
const PurchasedPlans = require("../models/purchasedPlansModel");
const Menu = require("../models/menuModel");
const Recipes = require("../models/recipeModel");
const RawIngredients = require("../models/raw_ingredientsModel");
const kitchenSection = require("../models/kitchenSectionCategorieModel");
const dietTypes = require("../models/dietTypesModel");
const Menus = require("../models/menuModel");
const express = require("express");
const Ingredient = require("../models/ingredientModel");
const router = express.Router();
function calculateDishCount(dishData, typeCounts) {
  const result = [];

  // Step 1: Get unique types from items
  const uniqueTypes = [
    ...new Set(dishData.flatMap((menu) => menu.items.map((item) => item.type))),
  ];

  uniqueTypes.forEach((type) => {
    // Step 2: Find the default dish for the type

    // Step 3: Calculate dish count
    let defaultDishCount = typeCounts[type] || 0; // Set default count
    let selectedUserCount = 0; // Track users who selected another dish

    // Step 4: Iterate over all items and adjust counts
    dishData.forEach((menu) => {
      menu.items.forEach((dish) => {
        if (dish.type === type) {
          if (!dish.isDefault) {
            // If not default, count selectedBy length
            selectedUserCount += dish.selectedBy.length;
            result.push({ dish: dish.dishId, count: dish.selectedBy.length });
          }
        }
      });
    });

    // find default dish
    const defaultDish = dishData
      .flatMap((menu) =>
        menu.items.find((dish) => dish.type === type && dish.isDefault)
      )
      .filter(Boolean)[0]; // Get the first default dish
    // Step 5: Subtract selected users from default dish count
    if (defaultDish) {
      result.push({
        dish: defaultDish.dishId,
        count: Math.max(defaultDishCount - selectedUserCount, 0),
      });
    }
  });

  return result;
}
async function CountTotalMealsForPlans(mealplans, bundlesPurchaseByUser) {
  const bundles = await PlanBundles.find({
    mealPlan: { $in: mealplans },
    _id: { $in: bundlesPurchaseByUser },
  });
  const countMealPerPlan = {};
  bundles.map((b, index) => {
    countMealPerPlan[b._id] = countMealPerPlan[b._id] || {};
    Object.entries(b.meals).forEach((c) => {
      countMealPerPlan[b._id][c[0]] =
        (countMealPerPlan[b._id][c[0]] || 0) + c[1];
    });
  });
  return countMealPerPlan;
}

const fetchDishDetails = async (itemsCount, finalCountByType) => {
  const finalReport = [];
  const finalDishCount = calculateDishCount(
    itemsCount,
    finalCountByType
  ).filter((dish) => dish.count > 0);
  console.log(finalDishCount);

  for (const dish of finalDishCount) {
    try {
      // Fetch dish details
      const searchDish = await Recipes.findOne({ _id: dish.dish });

      if (!searchDish) {
        console.log(`Dish with ID ${dish.dish} not found.`);
        continue;
      }

      // Fetch ingredients related to this dish
      const ingredients = await Ingredient.find({ recipe: searchDish._id });
      if (!ingredients.length) {
        console.log(`No ingredients found for dish ID ${dish.dish}.`);
        // continue;
      }

      // Calculate total grams
      let totalGrams = 0;
      const ingredientDetails = await Promise.all(
        ingredients.map(async (ingredient) => {
          // Fetch raw ingredient details to get the ingredient name
          const rawIngredient = await RawIngredients.findOne({
            _id: ingredient.rawIngredients,
          });

          // Filter out sizes with grams > 0
          const validSizes = ingredient.customizeSize.filter(
            (size) => size.grams > 0
          );

          // Sum up the total grams
          validSizes.forEach((size) => {
            totalGrams += size.grams;
          });

          return {
            ingredientId: ingredient._id,
            ingredientName: rawIngredient ? rawIngredient.name : "Unknown", // Include ingredient name
            rawIngredient: ingredient.rawIngredients,
            subRecipe: ingredient.subRecipe,
            isRemovable: ingredient.isRemovable,
            customizeSize: validSizes, // Store all valid sizes
          };
        })
      );

      // Push final data to report
      finalReport.push({
        dishId: searchDish._id,
        dishName: searchDish.name,
        dishKitchenSec:
          (await kitchenSection.findOne({ _id: searchDish.kitchenSection }))
            ?.name || null,
        dishDietType:
          (await dietTypes.findOne({ _id: searchDish.dietType }))?.name || null,
        sizes: Object.values(
          ingredientDetails.reduce((acc, ingredient) => {
            // Ensure `customizeSize` exists and is an array
            if (Array.isArray(ingredient.customizeSize)) {
              ingredient.customizeSize.forEach((size) => {
                if (size.grams > 0) {
                  if (!acc[size.name]) {
                    acc[size.name] = { size: size.name, ingredients: [] };
                  }
                  acc[size.name].ingredients.push({
                    grams: size.grams,
                    name: ingredient.ingredientName || "Unknown Ingredient", // Ensure there's always a name
                  });
                }
              });
            }
            return acc;
          }, {})
        ),
        totalGrams,
        ingredients: ingredientDetails,
        count: dish.count,
      });
    } catch (error) {
      console.error(`Error fetching details for dish ${dish.dish}:`, error);
    }
  }

  console.log("Final Report:", finalReport);
  return finalReport;
};

function mergeDishes(menuData) {
  const dishMap = {};

  Object.values(menuData).forEach((dishes) => {
    dishes.forEach((dish) => {
      if (!dishMap[dish.dishId]) {
        // Create a new entry for the dish if not present
        dishMap[dish.dishId] = { ...dish };
      } else {
        // Merge totalGrams and count
        dishMap[dish.dishId].totalGrams += dish.totalGrams;
        dishMap[dish.dishId].count += dish.count;
        console.log("---", dish);
        // Merge ingredient grams
        dish.ingredients.forEach((ingredient) => {
          let existingIngredient = dishMap[dish.dishId].ingredients.find(
            (ing) => ing.ingredientId === ingredient.ingredientId
          );

          if (existingIngredient) {
            // Add grams to existing ingredient
            existingIngredient.customizeSize.forEach((size, index) => {
              size.grams += ingredient.customizeSize[index]?.grams || 0;
            });
          } else {
            // Add new ingredient if not present
            dishMap[dish.dishId].ingredients.push({ ...ingredient });
          }
        });

        // Merge sizes
        dish.sizes.forEach((size) => {
          let existingSize = dishMap[dish.dishId].sizes.find(
            (s) => s.size === size.size
          );

          if (existingSize) {
            size.ingredients.forEach((sizeIngredient) => {
              let existingSizeIngredient = existingSize.ingredients.find(
                (ing) => ing.name === sizeIngredient.name
              );

              if (existingSizeIngredient) {
                existingSizeIngredient.grams += sizeIngredient.grams;
              } else {
                existingSize.ingredients.push({ ...sizeIngredient });
              }
            });
          } else {
            dishMap[dish.dishId].sizes.push({ ...size });
          }
        });
      }
    });
  });

  return Object.values(dishMap);
}

router.get("/api/report", async (req, res) => {
  try {
    // Extract all menu IDs
    const menuIds = await Menus.find({}, { _id: 1 });

    // Fetch all `mealplans` for the found menu IDs
    const containsPlanByMenu = await Menu.find(
      {
        _id: { $in: menuIds },
      },
      { mealplans: 1 }
    );

    if (containsPlanByMenu.length === 0) {
      console.log("No meal plans found for the given menus.");
      return;
    }

    // Create a menu-wise mapping of meal plans
    const menuMealPlanMap = {};
    containsPlanByMenu.forEach((menu) => {
      menuMealPlanMap[menu._id.toString()] = menu.mealplans || [];
    });

    // Initialize a final result object
    const menuWiseDishDetails = {};

    for (const menu of containsPlanByMenu) {
      const mealplans = menuMealPlanMap[menu._id.toString()];

      if (mealplans.length === 0) continue;

      // Fetch total users by plan & bundle for this menu
      const totalUserByPlanAndBundle = await PurchasedPlans.aggregate([
        {
          $match: {
            status: "active",
            plans: { $in: mealplans },
          },
        },
        {
          $group: {
            _id: {
              plan: "$plans",
              bundle: "$bundles",
            },
            users: { $push: "$user" },
            bundles: { $push: "$bundles" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Extract all unique bundles for this menu
      const allBundles = totalUserByPlanAndBundle
        .flatMap((bundle) => bundle.bundles)
        .filter(Boolean);

      // Calculate total meals by plan for this menu
      const totalMealsByPlan = await CountTotalMealsForPlans(
        mealplans,
        allBundles
      );

      // Compute final count by type
      const finalCountByType = {};
      Object.entries(totalMealsByPlan).forEach(([bundleId, Qty]) => {
        const userCount =
          totalUserByPlanAndBundle.find(
            (user) => user._id.bundle.toString() === bundleId.toString()
          )?.count || 0;

        Object.entries(Qty).forEach(([key, value]) => {
          finalCountByType[key] =
            (finalCountByType[key] || 0) + value * userCount;
        });
      });

      // Fetch dish details menu-wise

      const itemsCount = await MenuItems.find(
        {
          date: new Date().toISOString().split("T")[0],
          menu: menu._id,
        },
        { items: 1, menu: 1 }
      );

      if (itemsCount.length === 0) {
        console.log("No menu items found for today's date.");
      }
      menuWiseDishDetails[menu._id.toString()] = await fetchDishDetails(
        itemsCount,
        finalCountByType
      );
    }

    console.log(menuWiseDishDetails);

    res.status(200).json({
      success: true,
      data: mergeDishes(menuWiseDishDetails),
      // data: calculateDishCount(itemsCount, finalCountByType),
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating the report.",
      error: error.message,
    });
  }
});

module.exports = router;
