const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Enable CORS (allow frontend on port 5173)
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
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

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
