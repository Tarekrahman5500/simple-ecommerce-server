import {model, Schema} from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    },
})

// create virtual field

categorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

categorySchema.set('toJSON', {
    virtuals: true,
})

// in mongo db save as pts name
module.exports = model('Category', categorySchema)