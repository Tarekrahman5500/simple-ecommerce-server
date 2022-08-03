import {expressjwt} from "express-jwt";


// create function that prevent un auth login to access the api
function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // a user can check product
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            // a user can check categories
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            // a user can order  product
            {url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST']},
            // request for login
            `${api}/users/login`,
            // request for sign up
            `${api}/users/register`
        ]
    })
}

async function isRevoked(req, token) {
    return !token.payload.isAdmin
}

module.exports = authJwt