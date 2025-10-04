const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()


app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, 
  // origin: "https://book-review-system-two.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}))

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

// Define Routes
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/books", require("./routes/books"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/reading-list", require("./routes/readinglist"))


const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
