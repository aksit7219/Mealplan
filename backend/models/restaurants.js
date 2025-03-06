const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
    },
    // mealPlans: {
    //     type: [Schema.Types.ObjectId],
    //     ref: 'MealPlan',
    //     default: []
    // }
  },
  { timestamps: true }
);
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
