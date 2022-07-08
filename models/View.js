const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

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

ViewSchema.plugin(mongoosePaginate);

module.exports = Oficina = mongoose.model('view', ViewSchema)