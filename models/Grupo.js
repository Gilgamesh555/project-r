const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const GrupoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    codigo: {
        type: String,
        required: true,
        unique: true,
    },
    estado: {
        type: String,
        required: true,
    },
    vida: {
        type: String,
        required: true,
    },
    coe: {
        type: String,
        required: true,
    }
})

GrupoSchema.plugin(mongoosePaginate);

module.exports = Grupo = mongoose.model('grupo', GrupoSchema)