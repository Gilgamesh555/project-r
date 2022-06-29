const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const AuxiliarSchema = new mongoose.Schema({
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
    // descripcion: {
    //     type: String,
    //     required: true,
    // },
    grupoId: {
        type: String,
        required: true,
    }
})

AuxiliarSchema.plugin(mongoosePaginate)

module.exports = Auxiliar = mongoose.model('auxiliar', AuxiliarSchema)