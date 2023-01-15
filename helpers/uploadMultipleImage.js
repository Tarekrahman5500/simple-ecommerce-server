import fs from 'fs';
import Product from "../models/product";
import mongoose from "mongoose";
import cloudinary from "./cloud";


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (req, res, next) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  product id`
    })
    const pt = await Product.findById(id)
    if (!pt) return res.status(404).json({success: false, message: 'Product not found'})

    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({message: 'No files uploaded'});
        const file = JSON.parse(JSON.stringify(req.files)).images
        let imagesBuffer = [];
        //  console.log(file)
        for (let i = 0; i < file.length; i++) {
            //  console.log('here')
            const item = file[i];
            //   console.log(item)
            if (item.size > 1024 * 1024) {
                removeTmp(item.tempFilePath)
                return res.status(400).json({message: 'size too large'});
            }
            if (item.mimetype !== 'image/jpeg' && item.mimetype !== 'image/png' && item.mimetype !== 'image/jpg') {
                removeTmp(item.tempFilePath)
                return res.status(400).json({message: 'image is not a JPEG or PNG file'});
            }
            await cloudinary.uploader.upload(item.tempFilePath, {
                folder: 'images', width: '150', height: '150', crop: 'fill'
            }, async (err, result) => {
                if (err) throw err;
                fs.unlinkSync(item.tempFilePath)
                //  console.log(result.secure_url)
                imagesBuffer.push(result.secure_url)
            });
        }
        // save links in cloudinary.

        /* for (let i = 0; i < file.length; i++) {
               console.log('here')
             let item = req.file[i]
             console.log(item)
             await cloudinary.uploader.upload(item.tempFilePath, {
                 folder: 'images', width: '150', height: '150', crop: 'fill'
             }, async (err, result) => {
                 if (err) throw err;
                 fs.unlinkSync(item.tempFilePath)
                 console.log(result.secure_url)
                 imagesBuffer.push(result.secure_url)
             });
         }*/

        // wait for all file uploads
        await sleep(req.files.length * 3000);
        // console.log(imagesBuffer)
        req.imagesBuffer = imagesBuffer
        // pass in the next function

        next()
    } catch (err) {
        return res.status(500).json({success: false, error: err.message});
    }

}

