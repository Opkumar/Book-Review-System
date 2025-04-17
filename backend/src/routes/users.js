const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth"); // Ensure this is implemented correctly

const User = require("../models/User");
const Review = require("../models/Review");
const ReadingList = require("../models/ReadingList");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign JWT and send response
      jwt.sign(
        payload,
        process.env.JWT_SECRET,  // Make sure process.env.JWT_SECRET is defined
        { expiresIn: process.env.JWT_EXPIRE },  // Make sure process.env.JWT_EXPIRE is defined
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get user's reading list
    const readingList = await ReadingList.find({ user: req.params.id }).populate("book");

    // Get user's reviews
    const reviews = await Review.find({ user: req.params.id })
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 });

    // Add reading list to user object
    const userWithData = {
      ...user._doc,
      readingList: readingList.map((item) => item.book),
    };

    res.json(userWithData);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user exists and is the same as authenticated user
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Make sure user is updating their own profile
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const { name, bio, avatar } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (bio) userFields.bio = bio;
    if (avatar) userFields.avatar = avatar;

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true }).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
