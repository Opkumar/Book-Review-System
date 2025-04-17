const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  helpfulUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a user can only review a book once
ReviewSchema.index({ book: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("review", ReviewSchema)
