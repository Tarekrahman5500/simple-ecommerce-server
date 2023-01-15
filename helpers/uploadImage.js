import fs from 'fs';
import Product from "../models/product";
import mongoose from "mongoose";
import Category from "../models/category";


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = async (req, res, next) => {
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
    const pt = await Product.findById(id)
    // check category exist in db
    const ct = await Category.findById(category_id)
    if (!ct) return res.status(500).json({success: false, message: 'Invalid Category'})
    if (pt && !req.files) next()
    else {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({message: 'No files uploaded'});
            const file = req.files.image
            //  console.log(req.files)
            if (file.size > 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.status(400).json({message: 'size too large'});
            }
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.status(400).json({message: 'image is not a JPEG or PNG file'});
            }
            next()

        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    }
}