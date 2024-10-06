require('dotenv').config({ path: '../' });
const mongoose = require('mongoose');
const connectDB = async () => {
	console.log('Connecting to MongoDB:', process.env.MONGODB_URI);
	try {
		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		console.log('MongoDB connection error', error);
		process.exit(1);
	}
};

module.exports = connectDB;
