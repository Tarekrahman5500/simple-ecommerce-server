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

// in mongo db save as pts name
module.exports = model('Category', categorySchema)