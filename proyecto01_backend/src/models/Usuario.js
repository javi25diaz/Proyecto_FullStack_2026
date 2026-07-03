const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    rol: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Hook pre-save para hashear la contraseña
UsuarioSchema.pre('save', async function () {
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método helper para comparar la contraseña
UsuarioSchema.methods.compararPassword = async function (passwordCandidato) {
  return await bcrypt.compare(passwordCandidato, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
