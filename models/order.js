import {model, Schema} from "mongoose";

const orderSchema = new Schema({

    orderItems: [{
        // IT WILL REFER the category id not full details
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],

    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,

    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

orderSchema.set('toJSON', {
    virtuals: true,
})

// in mongo db save as pts name
module.exports = model('Order', orderSchema)