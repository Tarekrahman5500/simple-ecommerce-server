import {model, Schema} from "mongoose";

const userSchema = new Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    },
})

// create virtual field

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
userSchema.set('toJSON', {
    virtuals: true,
})

// in mongo db save as pts name
module.exports = model('User', userSchema)