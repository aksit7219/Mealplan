const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const upload = multer({ dest: "../uploads/" }); // Temporary storage for uploaded files
const Recipe = require("../models/recipeModel");
// API to handle CSV upload
router.post("/upload-recipes", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
 
  try {
    const recipes = [];

    // Read and parse CSV
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Map fields from CSV to Recipe schema
        recipes.push({
          name: row.name,
          description: row.description,
          type: row.type,
          cuisine: row.cuisine,
          category: row.category,
          dietType: row.dietType,
          price: parseFloat(row.price) || 0,
          validity: row.validity || "1 Day",
          tags: row.tags ? row.tags.split(",") : [],
          sizes: row.sizes ? row.sizes.split(",") : [],
          mealType: {
            Breakfast: row["mealType.Breakfast"] === "true",
            Lunch: row["mealType.Lunch"] === "true",
            Dinner: row["mealType.Dinner"] === "true",
          },
          instructions: row.instructions ? row.instructions.split("|") : [],
          image: row.image ? row.image.split(",") : [],
          restaurant: "66b4aa83fb4445b9c60eb780", // Default restaurant ID
          servingDetails: {
            description: row["servingDetails.description"] || "",
            yield: row["servingDetails.yield"] || 0,
            numberOfServings: row["servingDetails.numberOfServings"] || 0,
            totalGrams: row["servingDetails.totalGrams"] || 0,
            gramsPerServing: row["servingDetails.gramsPerServing"] || 0,
            createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
          },
        });
      })
      .on("end", async () => {
        // Save recipes to MongoDB
        try {
          console.log(recipes);
          const result = await Recipe.insertMany(recipes);
          res.status(200).json({
            message: `${result.length} recipes imported successfully.`,
          });
        } catch (error) {
          res.status(500).json({ message: "Error importing recipes", error });
        } finally {
          // Remove temporary file
          fs.unlinkSync(filePath);
        }
      });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
    // Remove temporary file in case of an error
    fs.unlinkSync(filePath);
  }
});

module.exports = router;
