const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const donationRoutes = require("./routes/donationRoutes");    // connect donation route 

const dashboardRoutes = require("./routes/dashboardRoute");

const app = express();


//"Express exposes the X-Powered-By header by default. 
// I disabled it to avoid revealing the backend technology stack,
//  which is a common security best practice."

app.disable("x-powered-by");

///limiter.

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 100,

    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes.",
    },

});

// Middleware 

//
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// app.use(limiter); // Disabled for local development testing to prevent rate limit blocks
app.use(express.json());


const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//express.static used to serve static file like images, css, js pdf to browser


// Routes

app.use("/api/auth", authRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Multer Error Handling
app.use((err, req, res, next) => {

  if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size should not exceed 2 MB",
      });
  }

  if (err.message === "Only JPG, JPEG and PNG images are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

    next(err);
});

app.get("/", (req, res) => {
  res.send("Welcome to Food Donation API");
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});