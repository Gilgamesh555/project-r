const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

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

StandSchema.plugin(mongoosePaginate);

module.exports = Stand = mongoose.model('stand', StandSchema)