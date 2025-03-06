const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  dishName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Array, required: true },
  ingredients: { type: Array, required: true },
  cuisine: { type: String, required: true },
  enabledisable: { type: String, required: true },
  image: { type: String}, // Assuming image URL or path
  dietaryRestrictions: { type: String },
  calories: { type: Number, required: true },
  fatContent: { type: Number, required: true },
  proteinContent: { type: Number, required: true },
  carbohydrateContent: { type: Number, required: true },
  fiberContent: { type: Number, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the `updatedAt` field on every save
dishSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
