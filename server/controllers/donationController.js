const Donation = require("../models/Donation");   // import donation model save donation data in mongodb 
const fs = require("fs");
const path = require("path");

// create donation
const addDonation = async (req, res)  => {
   try {

        const {
            foodName,
            quantity,
            quantityUnit,
            location,
            expiryTime,
            description,
            category,
        } = req.body;


        const VALID_CATEGORIES = ["Cooked Food", "Packaged Food", "Dry Food", "Fresh Produce", "Beverages", "Other"];

        // Remove extra spaces
        const trimmedFoodName = foodName ? foodName.trim() : "";
        const trimmedLocation = location ? location.trim() : "";
        const trimmedExpiryTime = expiryTime ? expiryTime.trim() : "";
        const trimmedDescription = description ? description.trim() : "";

        // Check required fields
        if (
            !trimmedFoodName ||
            !quantity ||
            !trimmedLocation ||
            !trimmedExpiryTime ||
            !trimmedDescription
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Food name must be at least 3 characters
        if (trimmedFoodName.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Food name must be at least 3 characters long",
            });
        }

        // Quantity must be greater than 0
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }

        // Image Validation
        if (!req.file) {
            return res.status(400).json({
             success: false,
             message: "Image is required",
            });
        }
        
        // Location Validation
        if (trimmedLocation.length < 3) {
            return res.status(400).json({
              success: false,
              message: "Location must be at least 3 characters long",
            });
        }

        // Expiry Time Validation
        if (trimmedExpiryTime.length < 3) {
            return res.status(400).json({
             success: false,
             message: "Please enter a valid expiry time",
            });
        }

        // Description Validation (Optional)
        if (trimmedDescription.length > 500) {
            return res.status(400).json({
             success: false,
             message: "Description cannot exceed 500 characters",
            });
        }

        // Category Validation
        const trimmedCategory = category ? category.trim() : "Other";
        if (!VALID_CATEGORIES.includes(trimmedCategory)) {
            return res.status(400).json({
                success: false,
                message: "Invalid food category",
            });
        }
        // CREATE DONATIOn

        const donation = new Donation({
            foodName: trimmedFoodName,
            quantity,
            quantityUnit: quantityUnit || undefined,
            location: trimmedLocation,
            expiryTime: trimmedExpiryTime,
            description: trimmedDescription,
            category: trimmedCategory,

            // Save uploaded image filename
            image: req.file.filename,

            donor: req.user.id,
        });

        // Save to MongoDB
        await donation.save();

        // Success Response
        res.status(201).json({
            success: true,
            message: "Donation Added Successfully",
            donation,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }

};


// get all AddDonation 
 // go to donations collection in mongodb and bring me every document


const getAllDonations = async (req, res) => {
    try {

        //current page (default =1)
        const page = parseInt(req.query.page) || 1;

        //Records per page (default = 5)
        const limit = parseInt(req.query.limit) ||5;

        //skip formula
        const skip = (page - 1) * limit;

        //sorting (default = newest)
        const sort = req.query.sort || "newest";

        let sortOption = {};

        if(sort === "newest") {
            sortOption = { createdAt: -1};
        }else if(sort === "oldest") {
            sortOption = { createdAt: 1};
        }else if(sort === "high") {
            sortOption = { quantity: -1};
        }else if(sort === "low") {
            sortOption = { quantity: 1};
        }


        // Search filter
        const search = req.query.search;
        const status = req.query.status;
        const location = req.query.location;
        const category = req.query.category;


        let filter = {};

        // Filter by donor ID if the user is a donor
        if (req.user && req.user.role === "donor") {
            filter.donor = req.user.id;
        }

        //search by food name 
        if(search) {
            filter.foodName ={
                $regex: search,
                $options: "i"
            };
        }

        //filter by status
        if(status) {
            filter.status = {
                $regex: status,
                $options: "i"
            };
        }

        //filter by location
        if(location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        // filter by category
        if(category) {
            filter.category = category;
        }

        //count Total donations
        const totalDonations = await Donation.countDocuments(filter);   //it give all donation according to filter condition 

        //fetch donations with pagination and sort
        const donations = await Donation.find(filter)    //filtering sorting and pagination
            .populate("donor", "name email phone")
            .populate("claimedBy", "name email phone")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        
        //Total pages
        const totalPages = Math.ceil(totalDonations / limit);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages,
            totalDonations,
            count: donations.length,
            donations,
        });
            


    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

//get availabledonation

const getAvailableDonations = async (req, res) => {
    try {

        const donations = await Donation.find({
            status: "Available",

        }).populate(
            "donor",
            "name email phone"
        ).populate(
            "claimedBy",
            "name email phone"
        );

        res.status(200).json({
            success: true,
            count: donations.length,
            donations,
        })


    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


//get claimedDonation

const getClaimedDonations = async (req, res) => {
    try {

        const donations = await Donation.find({
            status: "Claimed",

        }).populate(
            "donor",
            "name email phone"
        ).populate(
            "claimedBy",
            "name email phone"
        );

        res.status(200).json({
            success: true,
            count: donations.length,
            donations,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server.Error",
        });
    }
};



//Delivered Donation

const getDeliveredDonations = async (req, res) => {
    try { 

        const donations = await Donation.find({
           status: "Delivered",
        }).populate(
            "donor",
            "name email phone"
        ).populate(
            "claimedBy",
            "name email phone"
        );

        res.status(200).json({
            success: true,
            count: donations.length,
            donations,
        });

   } catch (error) {
    console.error(error);
     
     res.status(500).json({
        message: "Server Error",
     });
   }
};


const getDonationById = async (req, res) => {
    try {
        const id = req.params.id;

        const donation = await Donation.findById(id)
            .populate("donor", "name email phone")
            .populate("claimedBy", "name email phone");

        res.status(200).json({
            success: true,
            donation,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


const updateDonation = async (req, res) => {
    try {

        // Get donation id from URL
        const id = req.params.id;

        // Get data from request body
        const {
            foodName,
            quantity,
            quantityUnit,
            location,
            expiryTime,
            description,
            category,
        } = req.body;


        const VALID_CATEGORIES = ["Cooked Food", "Packaged Food", "Dry Food", "Fresh Produce", "Beverages", "Other"];

        // Find donation
        const donation = await Donation.findById(id);

        // Check donation exists
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation Not Found",
            });
        }

        // Check owner
        if (donation.donor.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this donation",
            });
        }

       
        // INPUT VALIDATION
      

        // Remove extra spaces
        const trimmedFoodName = foodName ? foodName.trim() : "";
        const trimmedLocation = location ? location.trim() : "";
        const trimmedExpiryTime = expiryTime ? expiryTime.trim() : "";
        const trimmedDescription = description ? description.trim() : "";

        // Required Fields
        if (
            !trimmedFoodName ||
            !quantity ||
            !trimmedLocation ||
            !trimmedExpiryTime ||
            !trimmedDescription
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Food Name Validation
        if (trimmedFoodName.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Food name must be at least 3 characters long",
            });
        }

        if (trimmedFoodName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Food name cannot exceed 100 characters",
            });
        }

        // Quantity Validation
        if (isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a number",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }

        // Location Validation
        if (trimmedLocation.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Location must be at least 3 characters long",
            });
        }

        // Expiry Time Validation
        if (trimmedExpiryTime.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid expiry time",
            });
        }

        // Description Validation
        if (trimmedDescription.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Description cannot exceed 500 characters",
            });
        }

        // Category Validation
        const trimmedCategory = category ? category.trim() : (donation.category || "Other");
        if (!VALID_CATEGORIES.includes(trimmedCategory)) {
            return res.status(400).json({
                success: false,
                message: "Invalid food category",
            });
        }

        
        // IMAGE UPDATE

        if (req.file) {

            // Delete old image
            if (donation.image) {

                const imagePath = path.join(
                    __dirname,
                    "../uploads",
                    donation.image
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log("Old image deleted successfully");
                }
            }

            donation.image = req.file.filename;
        }

     
        // UPDATE DONATION

        donation.foodName = trimmedFoodName;
        donation.quantity = quantity;
        if (quantityUnit) donation.quantityUnit = quantityUnit;
        donation.location = trimmedLocation;
        donation.expiryTime = trimmedExpiryTime;
        donation.description = trimmedDescription;
        donation.category = trimmedCategory;

        // Save
        await donation.save();

        res.status(200).json({
            success: true,
            message: "Donation Updated Successfully",
            donation,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


const deleteDonation = async (req, res) => {
    try {
        const id = req.params.id;

        //find donation 
        const donation = await Donation.findById(id);

        // check donation exists
        if(!donation) {
            return res.status(404).json({
                message: "Donation not found",
            });
        }


        // check owner
        if(donation.donor.toString() != req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not authorized to delete this donation",
            });
        }

        //delete image if it exists
        if(donation.image) {

            //create full image path
            const imagePath = path.join(
                __dirname,
                "../uploads",
                donation.image
            );

            //check if image exists
            if(fs.existsSync(imagePath)) {

                //delete image
                fs.unlinkSync(imagePath);

                console.log("Image deleted successfully");
            }
        }

        //Delete donation
        await donation.deleteOne();

        //send response
        res.status(200).json({
            success: true,
            message: "Donation deleted successfully",
        });

        
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


// CLAIMDONATION 

const claimDonation = async (req, res) => {
    try {
        const id = req.params.id;

    
        //check if logged-in user is ngo 
        if(req.user.role !== "ngo") {
            return res.status(403).json({
                message: "Only NGOs can claim donations",
            });
        }

        const donation = await Donation.findById(id);

        //check donation
        if(!donation) {
            return res.status(404).json({
                message: "Donation not found",
            });
        }

        //check already claimed
        if(donation.status === "Claimed") {
            return res.status(400).json({
                message: "Donation already claimed",
            });
        }

        //claim donation 

        //assign ngo to donation
        donation.claimedBy = req.user.id;
        
        //change status
        donation.status = "Claimed";

        //save changes
        await donation.save({ validateBeforeSave: false });

        //response
        res.status(200).json({
            success: true,
            message: "Donation Claimed Successfully",
            donation,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


const markAsDelivered = async (req, res) => {
    try {

        // get donation ID from URL
        const id = req.params.id;

        //only ngo can deliver
        if(req.user.role != "ngo") {
            return res.status(403).json({
                message: "Only NGOs can mark donation as delivered"
            })
        }

        //find donation by id 
        const donation = await Donation.findById(id);

        //check donation exists
        if(!donation) {
            return res.status(404).json({
                message: "Donation not found",
            });
        }

        //Donation must be claimed first
        if(donation.status !== "Claimed") {
            return res.status(400).json({
                message: "Donation must be claimed before delivery",
            });
        }

        //only the ngo who claimed the donation can deliver it
        if(donation.claimedBy.toString() != req.user.id) {
            return res.status(403).json({
                message: "You can only deliver donation you claimed",
            });
        }
        
        //mark donation as delivered
        donation.status = "Delivered";

        // save donation
        await donation.save({ validateBeforeSave: false });

        //send success response
        res.status(200).json({
            success: true,
            message: "Donation marked as Delivered Successfully",
            donation,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};



const searchDonation = async (req, res) => {
    try {

        //get query parameters
        const { foodName, location, status, category, minQuantity, maxQuantity, sort, startDate, endDate } = req.query;
        
        //create dynamic filter 
        const filter = {};

        // Sorting
        let sortOption = {};

        if (sort === "newest") {
         sortOption = { createdAt: -1 };
        }
        else if (sort === "oldest") {
          sortOption = { createdAt: 1 };
        }
        else if (sort === "high") {
           sortOption = { quantity: -1 };
        }
        else if (sort === "low") {
           sortOption = { quantity: 1 };
        }
        
        //search by food name 
        if (foodName) {
            filter.foodName = {
                $regex: foodName,
                $options: "i",
            };
        }


        //search by location 
        if (location) {
            filter.location = {
                $regex: location,
                $options: "i",
            };
        }

        //search by status
        if(status) {
            filter.status = status;
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by Quantity
        if (minQuantity || maxQuantity) {

            filter.quantity = {};

            if (minQuantity) {
             filter.quantity.$gte = Number(minQuantity);
            }

            if (maxQuantity) {
               filter.quantity.$lte = Number(maxQuantity);
            }

        }

        // Filter by Date Range
        if (startDate || endDate) {

           filter.createdAt = {};

            if (startDate) {
               filter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {

               // Include the entire end date
               const end = new Date(endDate);
               end.setHours(23, 59, 59, 999);

               filter.createdAt.$lte = end;
            }

        }

        

        // serach donations 
        const donations = await Donation.find(filter)
        .populate("donor","name email phone")
        .sort(sortOption);

        // No donations found
       if (donations.length === 0) {
            return res.status(200).json({
              success: true,
              message: "No donations found",
              count: 0,
              donations: [],
            });
        }

        res.status(200).json({
            success: true,
            mesage: "Donation fetched successfully",
            count: donations.length,
            donations,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};




//  Dashboard

const getDashboardStats = async(req, res) => {
    try { 

        const totalDonations = await Donation.countDocuments();

        const availableDonations = await Donation.countDocuments({
            status: "Available",
        });

        const claimDonations = await Donation.countDocuments({
            status: "Claimed",
        });

        const deliveredDonations = await Donation.countDocuments({
            status: "Delivered",
        });

        res.status(200).json({
            success: true,
            stats: {
                totalDonations,
                availableDonations,
                claimDonations,
                deliveredDonations,
            },
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {             // export function use inside donationrouter
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
    getDashboardStats,
};
 