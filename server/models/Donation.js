const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        foodName: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        expiryTime: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        donor: {
            type: mongoose.Schema.Types.ObjectId,    //object id store uniques id of user 
            ref: "User",
            required: true,
        },

        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,         //it store ngo's id
            ref: "User",
            default: null,
        },

        status: {
            type: String,
            enum: ["Available", "Claimed", "Delivered"],           //only this values are allowed
            default: "Available",     
        },

    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Donation", donationSchema);
