const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
require('dotenv').config();

// Import routes
const adddish_route = require("./routes/dishRoute");
const restaurants_route = require("./routes/restaurantsRoute");
const users_route = require("./routes/userRoute");
const mealplan_route = require("./routes/mealplanRoute");
const recipe_route = require("./routes/recipeRoute");
const ingredient_route = require("./routes/ingredientRoute");
const planBundle_route = require("./routes/planBundleRoute");
const delivery_route = require("./routes/deliveryRoute");
const menu_route = require("./routes/menuRoute");
const menuItem_route = require("./routes/menuItemsRoute");
const purchasedPlan_route = require("./routes/purchasedPlanRoutes");
const menuOverride_route = require("./routes/menuOverrideRoute");
const csvImport_route = require("./routes/csvImportRoute");
const imgUpload_route = require("./routes/imageUploadRoute");
const sizes_route = require("./routes/sizeRoute");
const dietType_route = require("./routes/dietTypesRoute");
const allergies_route = require("./routes/allergiesRoute");
const cusineType_route = require("./routes/cusineTypeRoute");
const mealType_route = require("./routes/mealTypeRoute");
const kitchenSecCategory_route = require("./routes/kitchenSecCateRoute");
const instructions_route = require("./routes/instructionsRoute");
const report = require("./routes/kitchenCalc");
const raw_ingredient_route = require("./routes/raw_ingredientsRoute");

// Import middleware
const isAuth = require("./middleware/isAuth");

// Initialize express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("MealPlan API is running");
});

// Public routes (no authentication required)
app.use(users_route);

// Protected routes (authentication required)
app.use(isAuth, adddish_route);
app.use(isAuth, restaurants_route);
app.use(isAuth, mealplan_route);
app.use(isAuth, recipe_route);
app.use(isAuth, ingredient_route);
app.use(isAuth, raw_ingredient_route);
app.use(isAuth, planBundle_route);
app.use(isAuth, delivery_route);
app.use(isAuth, menu_route);
app.use(isAuth, menuItem_route);
app.use(isAuth, purchasedPlan_route);
app.use(isAuth, menuOverride_route);
app.use(isAuth, csvImport_route);
app.use(isAuth, report);
app.use(isAuth, imgUpload_route);
app.use(isAuth, sizes_route);
app.use(isAuth, dietType_route);
app.use(isAuth, cusineType_route);
app.use(isAuth, allergies_route);
app.use(isAuth, mealType_route);
app.use(isAuth, kitchenSecCategory_route);
app.use(isAuth, instructions_route);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
