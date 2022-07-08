const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

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

RoleSchema.plugin(mongoosePaginate);

module.exports = Oficina = mongoose.model('role', RoleSchema)