const express = require("express");
const router = express.Router();
const multer = require("multer");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/img"); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage });
// Create an endpoint to handle file uploads
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "File upload failed" });
  }
  res.send({ filePath: `${req.file.originalname}` }); // Return the file path
});

module.exports = router;
