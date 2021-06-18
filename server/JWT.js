require('dotenv').config();

const {sign, verify} = require('jsonwebtoken')

function createToken(user) {
    const accessToken = sign({username : user.username, id: user.id}, process.env.COOKIE_SECRET);

    return accessToken;
}

function validateToken(req,res,next){

    const accessToken = req.cookies["access-token"]

    if(!accessToken){
        req.authenticated = false;
        return next();
    }

    try {
        const token = verify(accessToken, process.env.COOKIE_SECRET)
        
        if(token){
            req.authenticated = true;
            req.username = token.username
            return next();
        }
    } catch(err){
        req.authenticated = false;
        return next();
    }
}

module.exports = { createToken, validateToken }