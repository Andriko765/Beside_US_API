require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoutes');
const roomRoutes = require('./routers/roomRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
