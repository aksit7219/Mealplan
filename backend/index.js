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

const raw_ingredient_route = require("./routes/raw_ingredientsRoute");
const mongoose = require("mongoose");
const upload = require("./multerConfig");
const ing = require("./models/ingredientModel");
const Recipe = require("./models/recipeModel");
const Menu = require("./models/menuModel");
const MenuItems = require("./models/menuItemsModel");
const RawIngredient = require("./models/ingredientModel");
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
      "mongodb+srv://yjf246:k1ZKWobS0ecrgVr7@meals.gzqrl2d.mongodb.net/test-mealplan"
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


const isAuth = require("./middleware/isAuth");

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
