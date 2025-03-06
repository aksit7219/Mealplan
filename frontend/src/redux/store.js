import { configureStore } from "@reduxjs/toolkit";
import mealPlanReducer from "./reducers/mealPlanSlice";
import recipeReducer from "./reducers/recipeSlice";
import planBundleReducer from "./reducers/planBundleSlice";
import customerReducer from "./reducers/customerSlice";
import menuReducer from "./reducers/menuSlice";
import menuItemReducer from "./reducers/menuItemsSlice";
const store = configureStore({
  reducer: {
    mealPlan: mealPlanReducer,
    recipe: recipeReducer,
    planBundle: planBundleReducer,
    customers: customerReducer,
    menu: menuReducer,
    menuItem: menuItemReducer,
  },
});

export default store;
