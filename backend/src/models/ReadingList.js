const mongoose = require("mongoose")

const ReadingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a book is only added once to a user's reading list
ReadingListSchema.index({ user: 1, book: 1 }, { unique: true })

module.exports = mongoose.model("readingList", ReadingListSchema)
