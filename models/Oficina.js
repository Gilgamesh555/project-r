const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const OficinaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    codigo: {
        type: String,
        required: true,
        unique: true,
    },
    estado: {
        type: String,
        required: true,
    }
})

OficinaSchema.plugin(mongoosePaginate);

module.exports = Oficina = mongoose.model('oficina', OficinaSchema)