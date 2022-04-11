const mongoose = require('mongoose')

const ViewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isProtected: {
        type: Boolean,
        required: true,
    }
})

module.exports = Oficina = mongoose.model('view', ViewSchema)