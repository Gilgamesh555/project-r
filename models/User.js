const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apPaterno: {
        type: String,
    },
    apMaterno: {
        type: String,
    },
    ci: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    celular: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    oficinaId: {
        type: String,
        required: true
    },
})

module.exports = Activo = mongoose.model('user', UserSchema)