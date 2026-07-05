const Donation = require("../models/Donation");
const User = require("../models/User");

const donorDashboard = async(req, res) => {

    try {
          
        //Total donation
        const totalDonations = await Donation.countDocuments({
            donor: req.user.id,
        });


        // Available donation
        const availableDonations = await Donation.countDocuments({
            donor: req.user.id,
            status: "Available",
        });

        //claimed Donation
        const claimedDonations = await Donation.countDocuments({
            donor: req.user.id,
            status: "Claimed",
        });

        //Delivered Donation
        const deliveredDonations = await Donation.countDocuments({
            donor: req.user.id,
            status: "Delivered",
        });


        //send response

        res.status(200).json({
            success: true,
            dashboard: {
                totalDonations,
                availableDonations,
                claimedDonations,
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



// NGO DASHBOARD

const ngoDashboard = async (req, res) => {
    try {

        const claimedDonations = await Donation.countDocuments({
            claimedBy: req.user.id,
            status: "Claimed",
        });

        const deliveredDonations = await Donation.countDocuments({
            claimedBy: req.user.id,
            status: "Delivered",
        });

        res.status(200).json({
            success: true,
            dashboard: {
                claimedDonations,
                deliveredDonations,
            },
        });


    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};


//admindashboard

// ADMIN DASHBOARD

const adminDashboard = async (req, res) => {

    try {

        // Total Users
        const totalUsers = await User.countDocuments();

        // Total Donors
        const totalDonors = await User.countDocuments({
            role: "donor",
        });

        // Total NGOs
        const totalNGOs = await User.countDocuments({
            role: "ngo",
        });

        // Total Admins
        const totalAdmins = await User.countDocuments({
            role: "admin",
        });

        // Total Donations
        const totalDonations = await Donation.countDocuments();

        // Available Donations
        const availableDonations = await Donation.countDocuments({
            status: "Available",
        });

        // Claimed Donations
        const claimedDonations = await Donation.countDocuments({
            status: "Claimed",
        });

        // Delivered Donations
        const deliveredDonations = await Donation.countDocuments({
            status: "Delivered",
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalDonors,
                totalNGOs,
                totalAdmins,
                totalDonations,
                availableDonations,
                claimedDonations,
                deliveredDonations,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};





module.exports = {
    donorDashboard,
    ngoDashboard,
    adminDashboard,
};