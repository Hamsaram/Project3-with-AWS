const jwt = require('jsonwebtoken')
const bookModel = require("../model/bookModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')

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
        req.validUserId = decodedToken._id;
        
        next()
    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }
}

const authorisation = async function (req, res, next){
    try{
        // let token = req.headers['x-api-key']

        // if(!token){
        //     return res.status(400).send({status : false, message : "You are not Logged in Please logIn"})
        // }

        // let decodedToken = jwt.verify(token, "project3")
        // if(!decodedToken){
        //     return res.status(400).send({status : false, message : "Token validation failed"})
        // }

        // let userId = req.body.userId || req.query.userId || req.params.userId
        // if(!userId){
        //     return res.status(400).send({status : false, message : "UserId is required to proceed further!"})
        // }

        // if( userId != decodedToken._id){
        //     return res.status(401).send({status : false, message : "User is Not Authorised"})
        // }
        
        // next()
        let validUserId = req.validUserId
         let bookId = req.params.bookId
         let bodyData = req.body
         let queryData = req.query

        
        console.warn(`${validUserId} from Authorisation`);

         //  <--------Authorisation for Path Params And ReqBody--------->
         if((Object.keys(req.body)!=0) || (Object.keys(req.params)!=0)){

            // console.log(bodyData.userId)
            if (req.body.userId){
                if(!validator.isValidObjectId(bodyData.userId)) 
                return res.status().send({status :false, message:`This UserId (${bodyData.userId}) is invalid !!`})
                
        
                if( bodyData.userId != validUserId){
                    return res.status(403).send({status : false, message : "User is Not Authorised"})
                }
                return next();
            }

            if(req.params.bookId){
                if(!validator.isValidObjectId(bookId))
                return res.status().send({status :false, message:`This BookId (${bookId}) is invalid !!`})

                let fetchBookData = await bookModel.findById(bookId);
            
            console.log(fetchBookData)
            if(fetchBookData == null){
                return res.status(404).send({status :false, message: `No Book Found With This (${bookId})`})
            }
            console.log(`${validUserId} Token id`)
            if(fetchBookData.userId != validUserId){
                return res.status(403).send({status :false, message:"Sorry U are not Authorised !!"})
            }
            return next()
            }
            

        }

        return next();
    }
    catch(error){
        console.log(error)
        return res.status(500).send({status : false, message : error.message})
    }
}

    module.exports = {authentication, authorisation}

