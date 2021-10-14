const mongoose = require('mongoose')

const UfvSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true,
    },
    valor: {
        type: String,
        required: true,
        unique: true,
    },
    estado: {
        type: String,
        required: true,
    }
})

module.exports = Ufv = mongoose.model('ufv', UfvSchema)