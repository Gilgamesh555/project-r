const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const ActivoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
    },
    fechaIncorporacion: {
        type: String,
        required: true,
    },
    fechaRegistro: {
        type: String,
        required: true,
    },
    ufvId: {
        type: String,
        required: true,
    },
    grupoId: {
        type: String,
        required: true,
    },
    auxiliarId: {
        type: String,
        required: true,
    },
    oficinaId: {
        type: String,
        required: true,
    },
    usuarioId: {
        type: String,
        required: true,
    },
    estadoActivo: {
        type: String,
        required: true,
    },
    costoInicial: {
        type: String,
        required: true,
    },
    observaciones: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    }
    // vida: {
    //     type: String,
    //     required: true,
    // },
    // coe: {
    //     type: String,
    //     required: true,
    // }
})

ActivoSchema.plugin(mongoosePaginate);

module.exports = Activo = mongoose.model('activo', ActivoSchema)
