const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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

LogSchema.plugin(mongoosePaginate);

module.exports = Grupo = mongoose.model('logs', LogSchema)