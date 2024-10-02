require("dotenv").config({ path: "../" });
const mongoose = require("mongoose");
const connectDB = async () => {
  console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
