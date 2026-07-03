const express = require('express');
const router = express.Router();

const { login, renovarAccessToken } = require('../controllers/authController');

// Ruta POST /login
router.post('/login', login);

// Ruta POST /refresh-token
router.post('/refresh-token', renovarAccessToken);

module.exports = router;
