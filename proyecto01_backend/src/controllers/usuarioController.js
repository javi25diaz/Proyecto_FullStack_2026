const Usuario = require('../models/Usuario');

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear usuario',
      error: error.message
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    // Buscar todos los usuarios sin el campo password
    const usuarios = await Usuario.find().select('-password');

    res.status(200).json({
      ok: true,
      usuarios
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios
};