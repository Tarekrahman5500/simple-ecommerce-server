import express from 'express';
import User  from '../models/user'
const router = express.Router();

// make a simple get request
router.get(`/`, async (req, res) => {
    // return all data from db
    const users = await User.find()
    // if the list is empty
    if (!users) {
        res.status(500).json({success: false})
    } else
        res.send(users)
})

module.exports = router;