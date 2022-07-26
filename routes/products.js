import express from 'express';
import Product from "../models/product";
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

    //de structure
    const {name, image, countInStock} = req.body
    // create new instance of the product model
    const product = new Product({name, image, countInStock})
    // save the data
    try {
        await product.save()
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        })
    }
})

module.exports = router;



