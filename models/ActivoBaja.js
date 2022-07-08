const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

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
    },
    pdfPath: {
        type: String,
    }
})

ActivoBajaSchema.plugin(mongoosePaginate)

module.exports = ActivoBaja = mongoose.model('activoBaja', ActivoBajaSchema)