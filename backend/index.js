const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
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
const mongoose = require("mongoose");
const upload = require("./multerConfig");
const ing = require("./models/ingredientModel");
const Recipe = require("./models/recipeModel");
const Menu = require("./models/menuModel");
const MenuItems = require("./models/menuItemsModel");
const RawIngredient = require("./models/ingredientModel");
const PurchasedPlan = require("./models/purchasedPlansModel");
const { default: axios } = require("axios");
app.get("/", (req, resp) => {
  resp.send("success");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
const run = async () => {
  await mongoose
    .connect(
      "mongodb+srv://yjf246:k1ZKWobS0ecrgVr7@meals.gzqrl2d.mongodb.net/test-mealplan" //use 'test-mealplan' instead of meaplan for new db
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
    });
};
run();

app.listen(4000);
const planBundels = require("./models/planBundlesModel");

// var count=0
// async function addIngredients(data) {
//   for (const item of data) {
//     try {
//       const res = await axios.post("http://localhost:4000/raw-ingredients", item);
//       if (res.status==201) {
//         console.log("Added:", item.name);
//         count+=1;
//       } else {
//         console.log("Cancelled:", item.name);
//         count-=1;
//       }
//     } catch (error) {
//       console.error("Error adding ingredient:", item.name, error);
//     }
//   }
//   console.log("------",count)
// }

// Call the function to run it
// addIngredients(data);
const isAuth = require("./middleware/isAuth");
// const { default: report } = require("./routes/kitchencalc");

app.use(users_route);
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

// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   "title": "MERN",
//   "author": "plaak monn",
//   "published_date": "2024-09-03"
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// const sendRequests = async (count) => {
//   for (let i = 0; i < count; i++) {
//     try {
//       const response = await fetch("http://10.101.16.13:8000/api/books/", requestOptions);
//       const result = await response.text();
//       console.log(result);
//     } catch (error) {
//       console.log('error', error);
//     }
//   }
// };

// sendRequests(100000);
