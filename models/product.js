import {model, Schema} from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    images: [{
        type: String,
        default: "",
    }],
    brands: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        // IT WILL REFER the category id not full details
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews:{
        type: Number,
        default: 0,
    },
    isFeatured: {
        type:Boolean,
        default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
})

// in mongo db save as pts name
module.exports = model('Product', productSchema)

