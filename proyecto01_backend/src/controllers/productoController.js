const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.json({ ok: true, productos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos', error: error.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json({ ok: true, producto });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: 'Error al crear producto', error: error.message });
  }
};

module.exports = { obtenerProductos, crearProducto };
