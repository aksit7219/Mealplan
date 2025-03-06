const express = require('express');
const Restaurant = require('../models/restaurants')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');



// Create a new restaurant
router.post('/restaurants',async (req, res) => {
    
    const hashedPassword = await bcrypt.hash(req.body.passwordHash, 10);
    req.body.passwordHash=hashedPassword
    const newRestaurant = new Restaurant(req.body);
    newRestaurant.save()
        .then(restaurant => res.status(201).send({
            success: true,
            message: 'Restaurant created successfully!',
            restaurant
        }))
        .catch(err => res.status(400).send({
            success: false,
            message: 'Error creating restaurant',
            error: err.message
        }));
});

// Update a restaurant by ID
router.put('/restaurants/:id', (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).send({
                    success: false,
                    message: 'Restaurant not found'
                });
            }
            res.status(200).send({
                success: true,
                message: 'Restaurant updated successfully!',
                restaurant
            });
        })
        .catch(err => res.status(400).send({
            success: false,
            message: 'Error updating restaurant',
            error: err.message
        }));
});

// Delete a restaurant by ID
router.delete('/restaurants/:id', (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).send({
                    success: false,
                    message: 'Restaurant not found'
                });
            }
            res.status(200).send({
                success: true,
                message: 'Restaurant deleted successfully!'
            });
        })
        .catch(err => res.status(400).send({
            success: false,
            message: 'Error deleting restaurant',
            error: err.message
        }));
});

// Get a restaurant by ID
router.get('/restaurants/:id', (req, res) => {
    Restaurant.findById(req.params.id)
        .then(restaurant => {
            if (!restaurant) {
                return res.status(404).send({
                    success: false,
                    message: 'Restaurant not found'
                });
            }
            res.status(200).send({
                success: true,
                message: 'Restaurant retrieved successfully!',
                restaurant
            });
        })
        .catch(err => res.status(400).send({
            success: false,
            message: 'Error retrieving restaurant',
            error: err.message
        }));
});

// Get all restaurants
router.get('/restaurants', (req, res) => {
    Restaurant.find()
        .then(restaurants => res.status(200).send({
            success: true,
            message: 'Restaurants retrieved successfully!',
            restaurants
        }))
        .catch(err => res.status(400).send({
            success: false,
            message: 'Error retrieving restaurants',
            error: err.message
        }));
});

//Login route
router.post('/restaurants/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const restaurant = await Restaurant.findOne({  $or: [
      { email: email },
      { phone: email }
    ] },{_id:0});
    if (!restaurant) {
      return res.status(404).json({ error: 'No restaurant found with this email.' });
    }
    const isMatch = await bcrypt.compare(password, restaurant.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token=jwt.sign({id:restaurant._id},'thisisthemealplan',{ expiresIn: '1h' },{ algorithm: 'RS256' })
    res.status(200).send({
      success:true,
      token:token,
      message: 'Login successful!',
      restaurant: { ...restaurant._doc, password: undefined }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});
module.exports=router