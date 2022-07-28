import {expressjwt} from "express-jwt";


// create function that prevent un auth login to access the api
function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256']

    }).unless({
        path: [
            'api/v1/users/login'
        ]
    })
}
module.exports = authJwt