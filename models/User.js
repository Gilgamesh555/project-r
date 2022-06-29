const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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
        required: true,
        unique: true,
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

UserSchema.plugin(mongoosePaginate);

module.exports = Activo = mongoose.model('user', UserSchema)