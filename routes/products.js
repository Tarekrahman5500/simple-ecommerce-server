import express from 'express';
import Product from "../models/product";
import Category from "../models/category"
import mongoose from 'mongoose'

const router = express.Router();

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const product = await Product.find()
    // if the list is empty
    if (!product) {
        res.status(500).json({success: false})
    } else
        res.send(product)
})

// make a post request
router.post(`/`, async (req, res) => {
    // check id valid or not
    const category_id = req.body.category
    if (!mongoose.isValidObjectId(category_id)) return res.status(500).json(`${category_id} invalid  category id`)
    //de structure
    const {
        name,
        description,
        richDescription,
        image,
        brands,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
    } = req.body
    // check the category id is valid or not
    const categoryValidation = await Category.findById(category)
    if (!categoryValidation) return res.status(400).json(`${category} not found in category list`)

    // create new instance of the product model
    const product = new Product({
        name,
        description,
        richDescription,
        image,
        brands,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured
    })
    // save the data
    try {
        await product.save()
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({error: err, message: 'product save failed'})
    }
})

module.exports = router;



