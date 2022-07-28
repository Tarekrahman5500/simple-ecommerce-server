
const express = require('express');
const app = express();
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorhandler');
const {ServerApiVersion} = require ("mongodb");

const port = process.env.PORT || 5000
const api = process.env.API_URL || ''
//handle cors policy
app.use(cors())
app.options('*', cors())

// work done as middle ware body parser
app.use(express.json())
// for request activity
app.use(logger('dev'))
app.use(authJwt())
// handle error in the api
app.use(errorHandler)

app.use(express.urlencoded({extended: false}));
//Routes

const  productRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const  orderRouter = require('./routes/orders');
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