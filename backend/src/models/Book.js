const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "English",
  },
  pageCount: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("book", BookSchema)
