const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');


// make a simple get request
router.get(`/`, async (req, res) => {

    // filtered object because if query has no parameter then find is look like find({})
    let filtered = {}
    if (req.query.categories) {
        // api/v1/products/categories=12345,45555 means id,id
        let count = 0
        let id = req.query.categories.split(',')
        // convert object to string
        let value = String(Object.values(id)).split(',')
        filtered = {category: id}
        // get the fault id index
        let bug = 0
        // check the id is valid or not

        value.forEach(item => {
            // console.log(item)
            if (!mongoose.isValidObjectId(item)) {
                // count the invalid id
                count = 1
                // assign in fault index
                bug = value.indexOf(item)

            }
        });
        // check they are present or not this is custom handle by default catch will handle the error
        // I just play my own things default catch take around 6ms for per search custom take 2.2 - 2.8ms
        if(count) {
            return res.status(500).json({
                success: false,
                // show the fault index
                message: `${value[bug]} invalid  product id`
            })
        }
    }

    // return all data from db where select specific field -_id means remove that
    //populate means any collection with it must be show
    try {
        const product = await Product.find(filtered).select('name image category id').populate('category')
        // if the list is empty
        if (!product) {
            res.status(500).json({success: false, message: `category is not in the list`})
        } else
            res.send(product)
    } catch (err) {
        res.status(500).json({error: err, message: 'category  cannot be found'})
    }

})

// get single product
router.get(`/:id`, async (req, res) => {

    // check id valid or not
    const id = req.params.id
    // return for invalid id
    if (!mongoose.isValidObjectId(id))  res.status(500).json({
        success: false,
        message: `${id} invalid  product id`
    })
    else {
        try {
            // return all data from db populate means any collection with it must be show
            const product = await Product.findById(id).populate('category')

            // if the list is empty
            if (!product) {
                res.status(500).json({success: false, message: `${id} product is not in the list`})
            } else res.send(product)

        } catch (err) {
            res.status(500).json({error: err, message: 'product  cannot be found'})
        }
    }
})


// make a post request
router.post(`/`, async (req, res) => {
    // check id valid or not
    const category_id = req.body.category
    // return for invalid id
    if (!mongoose.isValidObjectId(category_id)) return res.status(500).json({
        success: false,
        message: `${category_id} invalid  category id`
    })
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
    if (!categoryValidation) return res.status(400).json({
        success: false,
        message: `${category} not found in category list`
    })

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

// update a product

router.put(`/:id`, async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  product id`
    })
    const category_id = req.body.category
    if (!mongoose.isValidObjectId(category_id)) return res.status(500).json({
        success: false,
        message: `${category_id} invalid  category id`
    })

    //else res.status(400).json({message: `${id} is not a valid Category`})
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

    try {
        let product = await Product.findByIdAndUpdate(id, {
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
        }, {new: true})
        if (product) {
            res.status(200).json(product)
        }
        // id is valid but not in db
        else res.status(404).json({success: false, message: `product with ${id} cannot be found`})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
// delete a product


router.delete(`/:id`, async (req, res) => {
    const id = req.params.id
    // check the user id is valid or not
    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  product id`
    })
    try {
        //check to delete
        const data = await Product.findByIdAndRemove(id)
        if (data) {
            // if delete success
            res.status(200).json({success: true, message: `product with ${id} deleted successfully`})
        }
        // id is valid but not in db
        else res.status(404).json({success: false, message: `product with ${id} cannot be found`})
    }
        // internal db error
    catch (err) {
        res.status(400).json({message: err.message})
    }
})

// custom route get total product number
router.get(`/get/count`, async (req, res) => {
    try {
        // return the number of the document
        const productCount = await Product.countDocuments()
        // if the list is empty
        if (!productCount) {
            res.status(500).json({success: false})
        } else
            res.json({Total: productCount})

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// custom route get total product featured
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? Number(req.params.count) : 0
    try {
        // return the number of the document
        const productFeatured = await Product.find({isFeatured: true}).limit(count)
        // if the list is empty
        if (!productFeatured) {
            res.status(500).json({success: false})
        } else
            res.json(productFeatured)

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})


module.exports = router;