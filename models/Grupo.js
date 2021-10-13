const mongoose = require('mongoose')

const GrupoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
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

module.exports = Grupo = mongoose.model('grupo', GrupoSchema)