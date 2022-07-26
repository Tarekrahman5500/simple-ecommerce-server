import express from 'express'
import Category from "../models/category"
import mongoose from 'mongoose'

const router = express.Router()

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const categories = await Category.find()
    // if the list is empty
    if (!categories) {
        res.status(500).json({success: false})
    } else
        res.status(200).send(categories)
})

// get a single category by id

router.get(`/:id`, async (req, res) => {
    const id = req.params.id
    // check the user id is valid or not
    if (mongoose.isValidObjectId(id)) {
        try {
            //check to delete
            const data = await Category.findById(id)
            if (data) {
                res.status(200).json(data)
            }
            // id is valid but not in db
            else res.status(500).json({success: false, message: `category with ${id} cannot be found`})
        }
            // internal db error
        catch (err) {
            res.status(400).json({message: err.message})
        }
    }
    // the id not a valid mongodb id
    else {
        res.status(400).json({message: `${id} is not a valid Category`})
    }
})

// add category

router.post(`/`, async (req, res) => {
    // get data from frontend
    const {name, icon, color} = req.body
    let category = new Category({name, icon, color})
    // save the data
    try {
        category = await category.save()
        res.status(201).json(category)
    } catch (err) {
        res.status(404).send(`category with ${name} cannot be created!`)
    }
})

// update a category

router.put(`/:id`, async (req, res) => {
    const id = req.params.id
    // get the query result
    // let field = req.query.fd;
    if (mongoose.isValidObjectId(id)) {
        const {name, icon, color} = req.body
        let category = new Category({name, icon, color})
        try {
            category = await Category.findByIdAndUpdate(id, {name, icon, color}, {new: true})
            if (category) {
                res.status(200).json(category)
            }
            // id is valid but not in db
            else res.status(404).json({success: false, message: `category with ${id} cannot be found`})
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    } else res.status(400).json({message: `${id} is not a valid Category`})
    //console.log(field)
    // res.send({ message: typeof req.body.search})
    //res.send({message: 'hi'})
})

// delete a category

router.delete(`/:id`, async (req, res) => {
    const id = req.params.id
    // check the user id is valid or not
    if (mongoose.isValidObjectId(id)) {
        try {
            //check to delete
            const data = await Category.findByIdAndRemove(id)
            if (data) {
                // if delete success
                const {name} = data
                res.status(200).json({success: true, message: `category with ${name} deleted successfully`})
            }
            // id is valid but not in db
            else res.status(404).json({success: false, message: `category with ${id} cannot be found`})
        }
            // internal db error
        catch (err) {
            res.status(400).json({message: err.message})
        }
    }
    // the id not a valid mongodb id
    else {
        res.status(400).json({message: `${id} is not a valid Category`})
    }
})

module.exports = router;