const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = "prathmesh77@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash("Prathmesh@7070", 10);

    if (!existingAdmin) {
      const admin = new User({
        name: "Prathmesh",
        email: adminEmail,
        password: hashedPassword,
        phone: "9875301253",
        role: "admin",
      });
      await admin.save();
      console.log("👤 Permanent Admin user seeded successfully!");
    } else {
      existingAdmin.name = "Prathmesh";
      existingAdmin.role = "admin";
      existingAdmin.phone = "9875301253";
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("👤 Permanent Admin user updated successfully!");
    }
  } catch (error) {
    console.error("❌ Seeding admin failed:", error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);    //it connect mongodb to node.js

    console.log("✅ MongoDB Connected Successfully");
    await seedAdmin();
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;