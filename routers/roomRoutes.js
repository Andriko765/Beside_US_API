const express = require('express');
const { createRoom, joinRoom } = require('../controllers/roomController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createRoom);
router.get(`/:roomId`, joinRoom);

module.exports = router;
