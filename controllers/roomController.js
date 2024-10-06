const Room = require('../models/Rooms');
const { v4: uuidv4 } = require('uuid');

const createRoom = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		// Логуємо req.user._id для перевірки
		console.log('ID користувача:', req.user._id);

		const inviteLink = `${req.protocol}://${req.get('host')}/rooms/${uuidv4()}`;

		const newRoom = await Room.create({
			creatorId: req.user._id, // Використовуємо ID користувача для кімнати
			code: inviteLink,
		});

		res.status(201).json({
			message: 'Room created successfully',
			inviteLink: inviteLink,
			room: newRoom,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Room creation failed' });
	}
};

const joinRoom = async (req, res) => {
	try {
		const roomId = req.params.roomId;
		const room = await Room.findOne({ code: roomId });

		if (!room) {
			return res.status(404).json({ message: 'Room not found' });
		}

		res.status(200).json({ message: 'Room found', room: room });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Room creation failed' });
	}
};

module.exports = { createRoom, joinRoom };
