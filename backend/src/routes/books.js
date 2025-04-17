const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const Book = require("../models/Book")
const Review = require("../models/Review")
const User = require("../models/User")

// @route   GET api/books
// @desc    Get all books with pagination, search, and filter
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit
    const search = req.query.search || ""
    const genre = req.query.genre || ""
    const sort = req.query.sort || "newest"

    // Build query
    let query = {}

    // Search
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    }

    // Genre filter
    if (genre && genre !== "all") {
      query.genre = genre
    }

    // Sort options
    let sortOption = {}
    switch (sort) {
      case "newest":
        sortOption = { publishedDate: -1 }
        break
      case "oldest":
        sortOption = { publishedDate: 1 }
        break
      case "rating":
        sortOption = { averageRating: -1 }
        break
      case "reviews":
        sortOption = { reviewCount: -1 }
        break
      default:
        sortOption = { publishedDate: -1 }
    }

    // Count total books matching query
    const totalBooks = await Book.countDocuments(query)
    const totalPages = Math.ceil(totalBooks / limit)

    // Get books with pagination
    const books = await Book.find(query).sort(sortOption).skip(skip).limit(limit)

    res.json({
      books,
      totalBooks,
      totalPages,
      currentPage: page,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/books/featured
// @desc    Get featured books
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const featuredBooks = await Book.find({ featured: true }).sort({ publishedDate: -1 }).limit(4)

    res.json(featuredBooks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ msg: "Book not found" })
    }

    // Get related books (same genre)
    const relatedBooks = await Book.find({
      genre: book.genre,
      _id: { $ne: book._id },
    })
      .sort({ averageRating: -1 })
      .limit(4)

    // Add related books to book object
    const bookWithRelated = {
      ...book._doc,
      relatedBooks,
    }

    res.json(bookWithRelated)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Book not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   POST api/books
// @desc    Add a new book
// @access  Private (Admin only)
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("author", "Author is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("genre", "Genre is required").not().isEmpty(),
      check("publishedDate", "Published date is required").not().isEmpty(),
      check("isbn", "ISBN is required").not().isEmpty(),
      check("publisher", "Publisher is required").not().isEmpty(),
      check("pageCount", "Page count is required").isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // Check if user is admin
      const user = await User.findById(req.user.id)
      if (user.role !== "admin") {
        return res.status(401).json({ msg: "Not authorized" })
      }

      // Check if book with ISBN already exists
      const existingBook = await Book.findOne({ isbn: req.body.isbn })
      if (existingBook) {
        return res.status(400).json({ msg: "Book with this ISBN already exists" })
      }

      const {
        title,
        author,
        description,
        genre,
        publishedDate,
        isbn,
        publisher,
        language,
        pageCount,
        coverImage,
        featured,
      } = req.body

      // Create new book
      const newBook = new Book({
        title,
        author,
        description,
        genre,
        publishedDate,
        isbn,
        publisher,
        language: language || "English",
        pageCount,
        coverImage,
        featured: featured || false,
      })

      const book = await newBook.save()
      res.json(book)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private (Admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id)
    if (user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" })
    }

    let book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ msg: "Book not found" })
    }

    const {
      title,
      author,
      description,
      genre,
      publishedDate,
      isbn,
      publisher,
      language,
      pageCount,
      coverImage,
      featured,
    } = req.body

    // Build book object
    const bookFields = {}
    if (title) bookFields.title = title
    if (author) bookFields.author = author
    if (description) bookFields.description = description
    if (genre) bookFields.genre = genre
    if (publishedDate) bookFields.publishedDate = publishedDate
    if (isbn) bookFields.isbn = isbn
    if (publisher) bookFields.publisher = publisher
    if (language) bookFields.language = language
    if (pageCount) bookFields.pageCount = pageCount
    if (coverImage) bookFields.coverImage = coverImage
    if (featured !== undefined) bookFields.featured = featured

    // Update book
    book = await Book.findByIdAndUpdate(req.params.id, { $set: bookFields }, { new: true })

    res.json(book)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Book not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id)
    if (user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" })
    }

    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ msg: "Book not found" })
    }

    await book.remove()

    // Also remove all reviews for this book
    await Review.deleteMany({ book: req.params.id })

    res.json({ msg: "Book removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Book not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router
