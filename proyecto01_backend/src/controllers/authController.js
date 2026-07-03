const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que ambos campos existan
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El email y la contraseña son obligatorios'
      });
    }

    // 2. Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // 3. Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Este usuario se encuentra inactivo'
      });
    }

    // 4. Comparar contraseñas
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // 5. Generar Access Token
    const accessPayload = {
      uid: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    const tokenExpires = process.env.JWT_EXPIRES_IN || '15m';
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: tokenExpires
    });

    // 6. Generar Refresh Token
    const refreshPayload = {
      uid: usuario._id,
      email: usuario.email,
      rol: usuario.rol
    };

    const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: refreshExpires
    });

    await RefreshToken.create({
      token: refreshToken,
      usuario: usuario._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // 7. Enviar respuesta sin incluir el password
    res.status(200).json({
      ok: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error en el proceso de inicio de sesión',
      error: error.message
    });
  }
};

const renovarAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // 1. Validar que exista el Refresh Token en el cuerpo
    if (!refreshToken) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El refresh token es obligatorio en la petición.'
      });
    }

    // 2. Verificar la firma y expiración del Refresh Token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh token inválido, alterado o expirado. Acceso denegado.'
      });
    }

    const tokenEnDB = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenEnDB) {
      return res.status(401).json({ ok: false, mensaje: 'Refresh token inválido, alterado o expirado. Acceso denegado.' });
    }

    // 3. Buscar al usuario en la base de datos para confirmar que sigue existiendo y está activo
    const usuario = await Usuario.findById(payload.uid);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        ok: false,
        mensaje: 'El usuario asociado a este token no existe o ha sido desactivado.'
      });
    }

    // 4. Generar un nuevo Access Token
    const accessPayload = {
      uid: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    const tokenExpires = process.env.JWT_EXPIRES_IN || '15m';
    const nuevoAccessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, {
      expiresIn: tokenExpires
    });

    // 5. Devolver el nuevo token
    res.status(200).json({
      ok: true,
      accessToken: nuevoAccessToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al renovar el token de acceso',
      error: error.message
    });
  }
};

module.exports = {
  login,
  renovarAccessToken
};
