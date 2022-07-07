const jwt = require('jsonwebtoken')

const middleware = async function (req, res, next) {
    
    try { 
        const token = req.headers['x-api-key']
        if (!token) {
            res.status(400).send({ status: false, msg: "request is missing a mandatory token header" })
        } 

        
        const decodedToken = jwt.verify(token, 'project3')
        if (!decodedToken) {
            res.status(400).send({ status: false, msg: "user not found" })
        } 
          req.validToken = decodedToken
          next() 
    }  catch (error) {
        
        res.status(400).send({ status: false, msg: error }) }
    }
    
module.exports.middleware = middleware;