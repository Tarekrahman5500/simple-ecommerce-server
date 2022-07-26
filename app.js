import express from 'express'
import cors from 'cors'
import {ServerApiVersion} from 'mongodb'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 5000
const api = process.env.API_URL || ''

import productRouter from './routes/products'
import categoriesRouter from './routes/categories'
import usersRouter from './routes/users'
import orderRouter from './routes/orders'

//handle cors policy
app.use(cors())
app.options('*',cors())

// work done as middle ware body parser
app.use(express.json())
// for request activity
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//handle mongodb
(async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'eshop-database',
            serverApi: ServerApiVersion.v1
        })
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
})().catch(console.dir)

// call routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, orderRouter);
//run the server
app.listen(port, () => {
    //   console.log(`${api}/products`)
    console.log(`app listening on port ${port}`)
})