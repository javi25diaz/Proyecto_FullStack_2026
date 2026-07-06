const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: 0
    },
    categoria: {
      type: String,
      trim: true,
      default: 'General'
    },
    icono: {
      type: String,
      default: '📦'
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', ProductoSchema);
