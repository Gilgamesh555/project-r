const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    }
})

module.exports = Oficina = mongoose.model('role', RoleSchema)