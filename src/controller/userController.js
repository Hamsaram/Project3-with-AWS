const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        let userSaved = await userModel.create(requestBody)
        res.status(201).send({ status: true, msg: "user successfully created", data: userSaved })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
} 

const loginUser= async function(req,res){
    try{
        let data = req.body
        const {email,password} = data
        let loginCheck = await userModel.findOne( { email: email, password: password } )  // to find that particular author document.
        if ( !loginCheck ) return res.status(403).send({ status: false, msg: "Email or password is incorrect." })  // if the author document isn't found in the database.

        let token = jwt.sign(  // --> to generate the jwt token
            {
             userId: loginCheck._id.toString(),     // --> payload
            },
            "manish-manjunath-hamsa", {expiresIn:'2000s'}          // --> secret key
        )
        res.setHeader("x-api-key", token)  // to send the token in the header of the browser used by the author(user).
        res.status(200).send({ status: true,msg:"user login successfully", 
        iat: new Date(),
        token: token })  // token is shown in the response body.
    } catch (err) {
        res.status(500).send({ status: false, err: err.message })
    }
    }

module.exports.createUser = createUser
module.exports.loginUser = loginUser