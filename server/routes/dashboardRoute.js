const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    donorDashboard,
    ngoDashboard,
    adminDashboard,
} = require("../controllers/dashboardController");

// Donor Dashboard
router.get(
    "/donor",
    authMiddleware,
    roleMiddleware("donor"),
    donorDashboard
);

// NGO Dashboard
router.get(
    "/ngo",
    authMiddleware,
    roleMiddleware("ngo"),
    ngoDashboard
);

// Admin Dashboard
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    adminDashboard
);

module.exports = router;