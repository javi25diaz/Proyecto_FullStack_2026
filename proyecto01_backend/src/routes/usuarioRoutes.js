const express = require('express');
const router = express.Router();

const { crearUsuario, obtenerUsuarios } = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', crearUsuario);
router.get('/', verificarToken, obtenerUsuarios);

module.exports = router;