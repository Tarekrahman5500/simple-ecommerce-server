import {model, Schema} from "mongoose";

const userSchema = new Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    },
})

// in mongo db save as pts name
module.exports = model('User', userSchema)