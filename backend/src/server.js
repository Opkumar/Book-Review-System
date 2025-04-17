const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Enable CORS (allow frontend on port 5173)
app.use(cors({
  origin: "https://book-review-system-two.vercel.app", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Add the methods you need
  credentials: true // Allow cookies to be sent if required
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


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
