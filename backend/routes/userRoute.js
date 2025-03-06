const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register Route
router.post("/regUser", async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      email,
      password: hashedPassword,
      ...otherData,
    });
    await user.save();
    console.log(user);
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

//Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await UserModel.findOne({
      $or: [{ email: email }, { firstName: email }],
    });
    if (!user) {
      return res.status(404).json({ error: "No user found with this email." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }
    const token = jwt.sign(
      { id: user._id },
      "thisisthemealplan",
      { expiresIn: "5h" },
      { algorithm: "RS256" }
    );
    res.status(200).send({
      success: true,
      token: token,
      message: "Login successful!",
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

router.get("/getSingleUser/:id", async (req, res) => {
  let userSingle = await UserModel.findOne({ _id: req.params.id });
  if (userSingle) {
    res.send(userSingle);
  } else {
    res.send(404).send({ userSingle: "No Record Found" });
  }
});

router.put("/putSingleUser/:id", async (req, resp) => {
  try {
    const update = await UserModel.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (update.nModified === 0) {
      return resp
        .status(404)
        .send({ message: "User not found or no changes made" });
    }

    resp.send({ message: "User updated successfully", update });
  } catch (error) {
    console.error(error);
    resp
      .status(500)
      .send({ message: "An error occurred while updating the user", error });
  }
});
//GetAllUser route
router.get("/getusers", async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users
    res.send({ data: users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
