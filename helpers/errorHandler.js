function errorHandler(err, req, res, next) {
    //jwt UnauthorizedError error
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: 'The user is not authorized'})
    }
    // validation error
    if (err.name === 'ValidationError') {
        return res.status(401).json({message: err})
    }
    // default 5000 server error
    return res.status(500).json({error: err})
}

module.exports = errorHandler