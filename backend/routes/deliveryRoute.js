const express = require("express");
const router = express.Router();
const DeliveryModel = require("../models/deliveryModel");
const { default: mongoose } = require("mongoose");
router.post('/newDelivery', async (req, res) => {
    try {
      const { customer, plan, time, location, apartmentFloor, driver, date, status } = req.body;
      const newDelivery = new DeliveryModel.Delivery({
        customer,
        plan,
        time,
        location,
        apartmentFloor,
        driver,
        date,
        status 
      });
      const savedDelivery = await newDelivery.save();
      res.status(201).json(savedDelivery);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while saving the delivery' });
    }
  });

router.get("/getDelivery", async (req, res) => {
try {
    const delivery = await DeliveryModel.Delivery.find(); 
    res.status(200).json(delivery);
} catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
}
});



router.post('/addDeliveryTiming', async (req, res) => {
  try {
    const { city, timings } = req.body;

    let existingCity = await DeliveryModel.DeliveryTiming.findOne({ city });

    if (existingCity) {
      existingCity.timings.push(...timings);

      const updatedCity = await existingCity.save();

      res.status(200).json({
        message: 'Timings updated successfully',
        data: updatedCity
      });
    } else {
      const newDeliveryTiming = new DeliveryModel.DeliveryTiming({
        city,
        timings
      });

      const savedTiming = await newDeliveryTiming.save();

      res.status(201).json({
        message: 'City and delivery timing added successfully',
        data: savedTiming
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Error adding or updating delivery timing',
      error
    });
  }
});

router.get('/getDeliveryTiming', async (req, res) => {
  try {
    const { city } = req.query;

    let deliveryTimings;

    if (city) {
      deliveryTimings = await DeliveryModel.DeliveryTiming.findOne({ city });

      if (!deliveryTimings) {
        return res.status(404).json({
          message: `No delivery timings found for the city: ${city}`,
        });
      }
    } else {
      deliveryTimings = await DeliveryModel.DeliveryTiming.find();
    }

    res.status(200).json({
      message: 'Delivery timings retrieved successfully',
      data: deliveryTimings,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error retrieving delivery timings',
      error,
    });
  }
});
  
router.put('/updateDeliveryTiming/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { timings } = req.body;

    if (!timings || !Array.isArray(timings)) {
      return res.status(400).json({ message: "Timings data is required and should be an array." });
    }

    const updatedCity = await DeliveryModel.DeliveryTiming.findOneAndUpdate(
      { city }, 
      { $set: { timings } }, 
      { new: true, runValidators: true } 
    );

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found." });
    }

    res.status(200).json({ message: "Delivery timings updated successfully", data: updatedCity });
  } catch (error) {
    console.error("Error updating delivery timings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.delete('/deleteTiming', async (req, res) => {
  try {
    const { city, title } = req.body;

    if (!city || !title) {
      return res.status(400).json({ message: 'City and title are required' });
    }

    const result = await DeliveryModel.DeliveryTiming.updateOne(
      { city: city }, 
      { $pull: { timings: { title: title } } } 
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No matching timing found for the given city and title' });
    }

    res.status(200).json({ message: 'Timing entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post("/addVehicle", async (req, res) => {

  try {
    // Create and save new delivery vehicle
    const newVehicle = new DeliveryModel.DeliveryVehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    // Error handling for unique plate number or other issues
    if (error.code === 11000) {
      res.status(400).json({ error: "Plate number must be unique" });
    } else {
      res.status(500).json({ error: "Failed to create delivery vehicle" });
    }
  }
});

router.get("/getDeliveryVehicles", async (req, res) => {
  try {
      const deliveryVehicles = await DeliveryModel.DeliveryVehicle.find(); 
      res.status(200).json(deliveryVehicles);
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
  });

  router.put('/editVehicle/:id', async (req, res) => {
    try {
      const { id } = req.params; 
      const vehicleData = req.body;
  
      const updatedVehicle = await DeliveryModel.DeliveryVehicle.findByIdAndUpdate(id, vehicleData, {
        new: true, 
        runValidators: true,
      });
  
      if (!updatedVehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
  
      res.status(200).json(updatedVehicle); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the vehicle' });
    }
  });

  router.delete('/deleteVehicle/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedVehicle = await DeliveryModel.DeliveryVehicle.findByIdAndDelete(id);
  
      if (!deletedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting vehicle', error });
    }
  });

  router.post("/addZone", async (req, res) => {
    try {
      const zone = new DeliveryModel.DeliveryZone(req.body);
      await zone.save();
      res.status(201).json(zone);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get("/getDeliveryZones", async (req, res) => {
    try {
        const deliveryZones = await DeliveryModel.DeliveryZone.find(); 
        res.status(200).json(deliveryZones);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    });

    router.put('/editZone/:id', async (req, res) => {
    const { id } = req.params;
    const updatedZone = req.body;
    
    try {
      const zone = await DeliveryModel.DeliveryZone.findByIdAndUpdate(id, updatedZone, { new: true });
      if (!zone) {
        return res.status(404).json({ message: 'Zone not found' });
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update zone', error });
    }
  });

  router.delete('/deleteZone/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const zone = await DeliveryModel.DeliveryZone.findByIdAndDelete(id);
      if (!zone) {
        return res.status(404).json({ message: 'Zone not found' });
      }
      res.json({ message: 'Zone deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete zone', error });
    }
  });

  router.post('/addDriver', async (req, res) => {
    try {
      const { name, phone, email, shift, license, password, vehicle, zones, profile, licenseFront, licenseRear } = req.body;
  
      const newDriver = new DeliveryModel.DeliveryDriver({
        name,
        phone,
        email,
        shift,
        license,
        password,
        vehicle,
        zones,
        profile,
        licenseFront,
        licenseRear
      });
  
      const savedDriver = await newDriver.save();
  
      res.status(201).json(savedDriver);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ error: `${field} already exists` });
      }
      res.status(500).json({ error: 'An error occurred while adding the driver', details: error.message });
    }
  });

  router.get("/getDeliveryDrivers", async (req, res) => {
    try {
        const deliveryDrivers = await DeliveryModel.DeliveryDriver.find(); 
        res.status(200).json(deliveryDrivers);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
    });

    router.put("/editDriver/:id", async (req, res) => {
      try {
        const driverId = req.params.id;
    
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
          console.log("Invalid driver ID:", driverId);
          return res.status(400).json({ error: "Invalid driver ID" });
        }
    
        const {
          name,
          phone,
          email,
          password,
          shift,
          license,
          vehicle,
          zones,
          profile,
          licenseFront,
          licenseRear,
        } = req.body;
    
        console.log("Request Body:", req.body);
    
        if (!name || !phone || !email || !shift || !license || !vehicle || !zones.length) {
          console.log("Missing required fields:", req.body);
          return res.status(400).json({ error: "Please fill all required fields" });
        }
    
        const updateData = {
          name,
          phone,
          email,
          shift,
          license,
          vehicle,
          zones,
          profile,
          licenseFront,
          licenseRear,
        };
    
        if (password) {
          updateData.password = password;
        }
    
        console.log("Updating driver with ID with data ");
    
        const updatedDriver = await DeliveryModel.DeliveryDriver.findByIdAndUpdate(
          driverId,
          { $set: updateData },
          { new: true, runValidators: true }
        );
    
        if (!updatedDriver) {
          console.log("Driver not found with ID:", driverId);
          return res.status(404).json({ error: "Driver not found" });
        }
    
        console.log("Driver successfully updated:");
    
        res.status(200).json(updatedDriver);
      } catch (error) {
        console.error("Error updating driver:", error.message);  
        res.status(500).json({ error: "An error occurred while updating the driver" });
      }
    });

    router.delete("/deleteDriver/:id", async (req, res) => {
      const driverId = req.params.id;
    
      try {
        const deletedDriver = await DeliveryModel.DeliveryDriver.findByIdAndDelete(driverId);
    
        if (!deletedDriver) {
          return res.status(404).json({ message: "Driver not found" });
        }
    
        res.status(200).json({ message: "Driver deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting driver", error});
      }
    });

    
module.exports = router;
