import express from 'express';
import User from '../models/user'
import bcrypt from 'bcryptjs'
import mongoose from "mongoose";
import jwt from "jsonwebtoken"


const router = express.Router();

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const users = await User.find().select('-passwordHash')
    // if the list is empty
    try {
        if (!users) {
            res.status(500).json({success: false})
        } else
          return  res.send(users)

    } catch (err) {
       return  res.status(500).json({error: err, message: 'user not found'})
    }
})

// create a new user

router.post(`/`, async (req, res) => {

    const {name, email, password, phone, isAdmin, street, apartment, zip, city, country} = req.body
    // hashing the password
    const passwordHash = bcrypt.hashSync(password, 10)
    let newUser = new User({name, email, passwordHash, phone, isAdmin, street, apartment, zip, city, country})
    try {
        newUser = await newUser.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({error: err, message: 'user create failed'})
    }

})

// get single user
router.get(`/:id`, async (req, res) => {

    // check id valid or not
    const id = req.params.id
    // return for invalid id
    if (!mongoose.isValidObjectId(id)) return res.status(500).json({
        success: false,
        message: `${id} invalid  user id`
    })

    try {
        // exclude password
        const user = await User.findById(id).select('-passwordHash')
        // if the list is empty
        if (!user) {
            res.status(500).json({success: false, message: `${id} user is not in the list`})
        } else res.send(user)

    } catch (err) {
        res.status(500).json({error: err, message: 'user  cannot be found'})
    }
})

//login

router.post(`/login`, async (req, res) => {

    const {email, password} = req.body
    const secret = process.env.SECRET_KEY
    try {
        const user = await User.findOne({email: email})
        if (!user) {
            res.status(500).json({success: false, message: 'user is not in the list'})
        }
        // bcrypt the password from db and compare to user given
        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            // create jwt
            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin,
            }, secret, {expiresIn : '1d'})
            // pass jwt
            res.send({user: user.email, token: token})
        } else res.status(400).json('password is incorrect')
    } catch (err) {
        res.status(500).json({error: err, message: 'user  cannot be found'})
    }

})


module.exports = router;