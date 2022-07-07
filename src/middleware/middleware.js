const jwt = require('jsonwebtoken')
const bookModel = require("../model/bookModel")
const validator = require("../validator/validator")

const authentication = async function (req, res, next){
    try{
        let token = req.headers['x-api-key']

        if(!token){
            return res.status(400).send({status : false, message : "You are not Logged in Please logIn"})
        }

        let decodedToken = jwt.verify(token, "project3")
        if(!decodedToken){
            return res.status(400).send({status : false, message : "Token validation failed"})
        }
        next()
    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }
}

const authorisation = async function (req, res, next){
    try{
        let token = req.headers['x-api-key']

        if(!token){
            return res.status(400).send({status : false, message : "You are not Logged in Please logIn"})
        }

        let decodedToken = jwt.verify(token, "project3")
        if(!decodedToken){
            return res.status(400).send({status : false, message : "Token validation failed"})
        }

        let userId = req.body.userId || req.query.userId || req.params.userId
        if(!userId){
            return res.status(400).send({status : false, message : "userId must be present"})
        }

        if( userId != decodedToken._id){
            return res.status(401).send({status : false, message : "Not Authorised"})
        }
        
        next()
    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }
}

    module.exports = {authentication, authorisation}

