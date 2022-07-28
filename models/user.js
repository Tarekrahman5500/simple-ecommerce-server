import {model, Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
   passwordHash:{
       type: String,
       required: true,
   } ,
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
    },
    street: {
        type: String,
        required: '',
    },
    apartment: {
        type: String,
        required: '',
    },
    zip: {
        type: String,
        required: '',
    },
    city: {
        type: String,
        required: '',
    },
    country: {
        type: String,
        required: '',
    },
})

// create virtual field id for frontend friendly

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
userSchema.set('toJSON', {
    virtuals: true,
})

// in mongo db save as users name
module.exports = model('User', userSchema)