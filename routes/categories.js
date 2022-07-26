import express from 'express'
import Category from "../models/category"
const router = express.Router()

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const categories = await Category.find()
    // if the list is empty
    if (!categories) {
        res.status(500).json({success: false})
    } else
        res.send(categories)
})

module.exports = router;