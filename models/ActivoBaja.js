const mongoose = require('mongoose')

const ActivoBajaSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    activoId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    }
})

module.exports = ActivoBaja = mongoose.model('activoBaja', ActivoBajaSchema)