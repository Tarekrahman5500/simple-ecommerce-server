import express from 'express';
import Order from '../models/order'
const router = express.Router();

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const orders = await Order.find()
    // if the list is empty
    if (!orders) {
        res.status(500).json({success: false})
    } else
        res.send(orders)
})

module.exports = router;