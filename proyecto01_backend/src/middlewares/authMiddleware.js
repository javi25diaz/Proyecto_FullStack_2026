const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // 1. Obtener el encabezado Authorization
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Acceso denegado. No se proporcionó un token de autenticación.'
    });
  }

  // 2. Validar el formato del encabezado "Bearer <TOKEN>"
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Formato de token inválido. Debe usar el esquema Bearer.'
    });
  }

  // 3. Extraer el token
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verificar firma y expiración del token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Guardar el payload en req.usuario
    req.usuario = payload;

    // 6. Ceder el control al siguiente middleware o controlador
    next();

  } catch (error) {
    console.error('Error al verificar el token:', error.message);

    // Mensaje específico si el token ha expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'El token ha expirado. Por favor, inicia sesión de nuevo.'
      });
    }

    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o firma alterada. Acceso denegado.'
    });
  }
};

module.exports = {
  verificarToken
};
