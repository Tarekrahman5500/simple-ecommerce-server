import { expressjwt} from "express-jwt";


// create function that prevent un auth login to access the api
function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return  expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/users/login`
        ]
    })
}

async function isRevoked(req, token) {
    return !token.payload.isAdmin;


}
module.exports = authJwt