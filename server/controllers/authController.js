const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER USER
const registerUser = async (req, res) => {
    try {

        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (role === "admin") {
            return res.status(400).json({
                message: "Administrator accounts cannot be registered",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            const lowerEmail = email.toLowerCase();
            // Block automatic creation of admin accounts for security
            if (lowerEmail.includes("admin")) {
                return res.status(401).json({
                    message: "Administrator accounts cannot be auto-created.",
                });
            }

            // Auto-create test users (Donor or NGO)
            let role = "donor";
            if (lowerEmail.includes("ngo")) {
                role = "ngo";
            }
            
            const hashedPassword = await bcrypt.hash(password || "123456", 10);
            user = new User({
                name: email.split("@")[0], // Use email prefix as name
                email: lowerEmail,
                phone: "8798456212",
                password: hashedPassword,
                role,
            });
            await user.save();
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// GET ALL USERS (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search;

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { role: { $regex: search, $options: "i" } }
                ]
            };
        }

        const totalUsers = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// DELETE USER (Admin only)
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Prevent admin from deleting themselves
        if (id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account",
            });
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete user's donations (cascade deletion)
        const Donation = require("../models/Donation");
        await Donation.deleteMany({ donor: id });

        // Update donations claimed by this user to make them available again
        await Donation.updateMany(
            { claimedBy: id },
            { $set: { status: "Available" }, $unset: { claimedBy: "" } }
        );

        // Delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// FORGOT PASSWORD / PASSWORD RESET
const forgotPassword = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this email",
            });
        }

        if (user.phone !== phone) {
            return res.status(400).json({
                message: "Phone number does not match our records",
            });
        }

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    forgotPassword,
};