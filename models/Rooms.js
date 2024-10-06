const mongoose = require('mongoose');

const RoomsSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	players: [Object],
	maxPlayers: Number,
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Room = mongoose.model('Room', RoomsSchema);

module.exports = Room;
