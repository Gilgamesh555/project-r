const mongoose = require('mongoose')

const OficinaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    codigo: {
        type: String,
        required: true,
        unique: true,
    },
    estado: {
        type: String,
        required: true,
    }
})

module.exports = Oficina = mongoose.model('oficina', OficinaSchema)