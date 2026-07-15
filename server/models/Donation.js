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

        quantityUnit: {
            type: String,
            enum: ["pieces", "dozens", "servings", "kg", "grams", "vessels", "packets", "boxes", "bunches", "liters", "ml", "bottles", "cans"],
            required: false,   // not required so old donations without unit don't break
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

        category: {
            type: String,
            enum: ["Cooked Food", "Packaged Food", "Dry Food", "Fresh Produce", "Beverages", "Other"],
            default: "Other",
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
