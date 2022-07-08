const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const RoleViewSchema = new mongoose.Schema({
    roleId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        required: true,
    },
    isVisible: {
        type: Boolean,
        required: true,
    },
    isEditable: {
        type: Boolean,
        required: true,
    },
    isDeletable: {
        type: Boolean,
        required: true,
    },
    isAddble: {
        type: Boolean,
        required: true,
    }
});

RoleViewSchema.plugin(mongoosePaginate);

RoleViewSchema.index({roleId: 1, viewId: 1}, {unique: true});

module.exports = Oficina = mongoose.model('roleView', RoleViewSchema);