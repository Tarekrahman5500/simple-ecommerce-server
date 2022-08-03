import express from 'express';
import Order from '../models/order'
import OrderItem from '../models/OrderItem'
import mongoose from "mongoose";

const router = express.Router();

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db get username sort according to date in descending
    const orders = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}).populate({
        path: 'orderItems',
        populate: {
            path: 'product', populate: 'category'
        }
    })
    // if the list is empty
    if (!orders) {
        res.status(500).json({success: false})
    } else
        res.send(orders)
})

// get a single order list

router.get(`/:id`, async (req, res) => {
    // check id valid or not
    const id = req.params.id
    // return for invalid id
    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  product id`
    })
    try {
        // return all data from db get username
        const orders = await Order.findById(id).populate('user', 'name').populate({
            path: 'orderItems',
            populate: {
                path: 'product', populate: 'category'
            }
        })
        // if the list is empty
        if (!orders) {
            res.status(500).json({success: false})
        } else
            res.send(orders)
    } catch (err) {
        res.status(500).json({error: err, message: 'order  cannot be found'})
    }
})

// post order

router.post(`/`, async (req, res) => {

    //get thr orders items id from frontend
    // check the given product id is correct or not
    if (!mongoose.isValidObjectId(req.body.user)) {
        return res.status(404).send(`${req.body.user} invalid user id`)
    }
    let count = 0
    let Pid
    req.body.orderItems.forEach(orderItem => {

        if (!mongoose.isValidObjectId(orderItem.product)) {
            count = count + 1
            Pid = orderItem.product
        }
    })
    // if product id incorrect then return error
    if (count) {
        return res.status(404).send(`${Pid} invalid product id`)
    }
    // check the user is invalid or not

    // id ok then save the order
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {

        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        // save in db
        try {
            newOrderItem = await newOrderItem.save()
            // return the id only
            return newOrderItem._id
        } catch (err) {
            return res.status(404).send(`order cannot be created!`)
        }


    }))
    // resolve promise
    const orderItemIdsResolves = await orderItemsIds


    //  console.log(orderItemIdsResolves)
    const {
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status,
        user,
    } = req.body

    // calculate total price
    const totalPrices = await Promise.all(orderItemIdsResolves.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        //  console.log(orderItem)
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)
    // console.log(totalPrices)
    let order = new Order({
        orderItems: orderItemIdsResolves,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status,
        totalPrice: totalPrice,
        user,
    })
    // save the data
    try {
        order = await order.save()
        return res.status(201).json(order)
    } catch (err) {
        res.status(404).send({error: err})
    }


})

// update the status of delivery

router.put(`/:id`, async (req, res) => {
    const id = req.params.id
    // check the user id is valid or not
    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  order id`
    })
    try {
        //check to delete
        let order = await Order.findByIdAndUpdate(id, {status: req.body.status}, {new: true})
        if (order) {
            // if delete success
            res.status(200).json({success: true, status: order.status})
        }
        // id is valid but not in db
        else res.status(404).json({success: false, message: `order with ${id} cannot be update status`})
    }
        // internal db error
    catch (err) {
        res.status(400).json({message: err.message})
    }
})

// remove a order

router.delete(`/:id`, async (req, res) => {
    const id = req.params.id
    // check the user id is valid or not
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({message: `${id} is not a valid order`})
    }
    // the id not a valid mongodb id
    try {
        let order = await Order.findByIdAndRemove(id)
        if (order) {
            order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "order not found!"})
        }
    } catch (err) {
        return res.status(500).json({success: false, error: err})
    }
})
// get total amount of an order


module.exports = router;