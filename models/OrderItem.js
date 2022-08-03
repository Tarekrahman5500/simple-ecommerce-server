import {model, Schema} from "mongoose";

const orderItemSchema = new Schema({

    quantity: {
        type: Number,
        required: true,
    },
    product: {

        type: Schema.Types.ObjectId,
        ref: 'Product'
    },

})

orderItemSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

orderItemSchema.set('toJSON', {
    virtuals: true,
})

// in mongo db save as pts name
module.exports = model('OrderItem', orderItemSchema)