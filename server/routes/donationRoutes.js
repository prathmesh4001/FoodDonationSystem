const express = require("express");
const router  = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const roleMiddleware = require("../middleware/roleMiddleware");


const {
       addDonation, 
       getAllDonations, 
       getDonationById, 
       updateDonation, 
       deleteDonation,
       claimDonation,
       markAsDelivered, 
       getAvailableDonations, 
       getClaimedDonations, 
       getDeliveredDonations,
       searchDonation,
       getDashboardStats
    } = require("../controllers/donationController");


router.get("/test", authMiddleware, (req,res) => {           // protected route before going to controller first check middleware 
    res.json({
        message: "Protected Route Accessed Successfully",
    });
});

//donation route

//Add
router.post(
    "/add",
    authMiddleware,
    roleMiddleware("donor"),
    (req, res, next) => {

        upload.single("image")(req, res, function (err) {

            if (err) {

                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "Image size should not exceed 2 MB",
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }

            next();
        });

    },
    addDonation
);

//Get all donation
router.get("/",authMiddleware,  getAllDonations); 

//getAvailabledonation
router.get("/available", authMiddleware, getAvailableDonations);

//getclaimeddonation
router.get("/claimed", authMiddleware, getClaimedDonations);

//getdelivereddonation
router.get("/delivered", authMiddleware, getDeliveredDonations);

//search donation 
router.get("/search", authMiddleware, searchDonation);

//dashboardstats
router.get(
    "/dashboard/stats", 
    authMiddleware, 
    roleMiddleware("admin"),
    getDashboardStats
);



//Update donation
router.put(
    "/update/:id",
    authMiddleware,
    roleMiddleware("donor"),
    (req, res, next) => {

        upload.single("image")(req, res, function (err) {

            if (err) {

                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "Image size should not exceed 2 MB",
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }

            next();
        });

    },
    updateDonation
);

//delete donation
router.delete(
    "/delete/:id", 
    authMiddleware, 
    roleMiddleware("donor"),
    deleteDonation
);

//claim donation
router.put(
    "/claim/:id", 
    authMiddleware, 
    roleMiddleware("ngo"),
    claimDonation
);

//deliver donation
router.put(
    "/deliver/:id", 
    authMiddleware, 
    roleMiddleware("ngo"),
    markAsDelivered
);


//Get single donation
router.get("/:id",authMiddleware, getDonationById);


module.exports = router;