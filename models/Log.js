const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
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
    }
})

module.exports = Grupo = mongoose.model('logs', LogSchema)