const mongoose = require('mongoose')

const StandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
})

module.exports = Stand = mongoose.model('stand', StandSchema)