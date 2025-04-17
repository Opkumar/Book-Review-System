const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const Review = require("../models/Review")
const Book = require("../models/Book")
const User = require("../models/User")

// @route   GET api/reviews
// @desc    Get reviews (filter by book or user)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const bookId = req.query.bookId
    const userId = req.query.userId

    const query = {}

    if (bookId) {
      query.book = bookId
    }

    if (userId) {
      query.user = userId
    }

    const reviews = await Review.find(query)
      .populate("user", "name avatar")
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/reviews
// @desc    Add a review
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("bookId", "Book ID is required").not().isEmpty(),
      check("rating", "Rating is required").isInt({ min: 1, max: 5 }),
      check("content", "Content is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { bookId, rating, title, content } = req.body

      // Check if book exists
      const book = await Book.findById(bookId)
      if (!book) {
        return res.status(404).json({ msg: "Book not found" })
      }

      // Check if user has already reviewed this book
      const existingReview = await Review.findOne({
        book: bookId,
        user: req.user.id,
      })

      if (existingReview) {
        return res.status(400).json({ msg: "You have already reviewed this book" })
      }

      // Create new review
      const newReview = new Review({
        book: bookId,
        user: req.user.id,
        rating,
        title,
        content,
      })

      const review = await newReview.save()

      // Populate user and book info
      await review.populate("user", "name avatar").populate("book", "title author coverImage").execPopulate()

      // Update book's average rating and review count
      const allReviews = await Review.find({ book: bookId })
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / allReviews.length

      await Book.findByIdAndUpdate(bookId, {
        averageRating,
        reviewCount: allReviews.length,
      })

      res.json(review)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// @route   PUT api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ msg: "Review not found" })
    }

    // Make sure user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    const { rating, title, content } = req.body

    // Build review object
    const reviewFields = {}
    if (rating) reviewFields.rating = rating
    if (title !== undefined) reviewFields.title = title
    if (content) reviewFields.content = content

    // Update review
    review = await Review.findByIdAndUpdate(req.params.id, { $set: reviewFields }, { new: true })
      .populate("user", "name avatar")
      .populate("book", "title author coverImage")

    // Update book's average rating
    const bookId = review.book._id || review.book
    const allReviews = await Review.find({ book: bookId })
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    await Book.findByIdAndUpdate(bookId, {
      averageRating,
    })

    res.json(review)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ msg: "Review not found" })
    }

    // Make sure user owns the review or is admin
    const user = await User.findById(req.user.id)
    if (review.user.toString() !== req.user.id && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" })
    }

    const bookId = review.book

    await review.remove()

    // Update book's average rating and review count
    const allReviews = await Review.find({ book: bookId })

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / allReviews.length

      await Book.findByIdAndUpdate(bookId, {
        averageRating,
        reviewCount: allReviews.length,
      })
    } else {
      // No reviews left
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0,
      })
    }

    res.json({ msg: "Review removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/reviews/:id/helpful
// @desc    Mark a review as helpful
// @access  Private
router.put("/:id/helpful", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ msg: "Review not found" })
    }

    // Check if user has already marked this review as helpful
    if (review.helpfulUsers.includes(req.user.id)) {
      return res.status(400).json({ msg: "You have already marked this review as helpful" })
    }

    // Add user to helpfulUsers array and increment helpfulCount
    review.helpfulUsers.push(req.user.id)
    review.helpfulCount = review.helpfulUsers.length

    await review.save()

    // Populate user and book info
    await review.populate("user", "name avatar").populate("book", "title author coverImage").execPopulate()

    res.json(review)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Review not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router
