const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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

UfvSchema.plugin(mongoosePaginate);

module.exports = Ufv = mongoose.model('ufv', UfvSchema)