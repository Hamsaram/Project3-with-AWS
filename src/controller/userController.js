const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validator = require('validator')

// globelly function to validate a key 

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

// globelly function to validate request body is empty or not

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


// const isValidTitle = function (title) {  
//     return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
// }


// first create user api 

const createUser = async function (req, res) {
    try {

        let requestBody = req.body

        //validation of request body and body keys 

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' }) //change -- write user instead of author
            return
        }

        if (!isValid(requestBody.title)) {
            res.status(400).send({ status: false, message: 'title is required' })
            return
        }

        if (!isValidTitle(requestBody.title.trim())) {  //change--add this function and use trim()
            res.status(400).send({ status: false, message: `Title should be among Mr, Mrs and Miss` })
            return
        }

        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: ' name is required' })
            return
        }

        if (!/^[a-zA-Z.-]+$/.test( requestBody.name)) {
            return res.status(400).send({ status: false, message: "Please enter valid name " })
        }

        if (!isValid(requestBody.phone)) {
            res.status(400).send({ status: false, message: 'phone  is required' })
            return
        }


        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }

        if (!isValid(requestBody.password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
            
        }
        
        if (Object.keys(requestBody.address).length === 0) {
            return res.status(400).send({ status: false, message: 'address cant be empty' })
            
        }

        if (requestBody.address) {
            if (!isValid(requestBody.address.street)) {
                return res.status(400).send({ status: false, message: 'street is required' })
                
            }

            if (!isValid(requestBody.address.city)) {
                return res.status(400).send({ status: false, message: 'city is required' })
                
            }

            if (!isValid(requestBody.address.pincode)) {
                return res.status(400).send({ status: false, message: 'pincode is required' })
                
            }

        }

        // number minimum and maximum check validation

        if (!(requestBody.password.length >= 8 && requestBody.password.length <= 15)) {
            return res.status(400).send({ status: false, message: 'password length should be greter then 8 and less than 15' })
            
        }

        //  correct formate validation  number and email check email or number is valid or not 

        let check1 = requestBody.phone
        let check2 = /^[0-9]{10}$/
        if (!check2.test(check1)) return res.status(400).send({status:false,msg:"Please Enter a valid phone"});


        if (!(validator.isEmail(requestBody.email.trim()))) {   //change -- add trim() otherwise say invalid email
            return res.status(400).send({ status: false, msg: 'enter valid email' })
        }

        // unique validation number and email

        const isphoneAlreadyUsed = await userModel.findOne({ phone: requestBody.phone });

        if (isphoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${requestBody.phone} phone no. is already registered` })
            
        }



        const isEmailAlreadyUsed = await userModel.findOne({ email: requestBody.email }); 

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${requestBody.email} email is already registered` }) 
           
        }
        // sucessfully create user data in database

        let userSaved = await userModel.create(requestBody);
        res.status(201).send({ status: true,msg: "user successfully created", data: userSaved });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


//second Login api
const loginUser = async function (req, res) {
    try {

        let requestBody = req.body
        // request body validation 
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        if (requestBody.email && requestBody.password) {
            // email id or password is valid or not check validation 
            let userEmail = await userModel.findOne({ email: requestBody.email });
            if (!userEmail) {
                return res.status(400).send({ status: true, msg: "Invalid user email" })
            }
            let userPassword = await userModel.findOne({ password: requestBody.password });
            if (!userPassword) {
                return res.status(400).send({ status: true, msg: "Invalid user password" })
            }
            // jwt token create and send back the user
            let payload = { _id: userEmail._id }
            let token = jwt.sign(payload, 'projecthird', { expiresIn: '1500s' })
            res.header('x-api-key', token);
            res.status(200).send({ status: true, data: " user  login successfull", token: { token } })
            iat: new Date()
        } else {

            res.status(400).send({ status: false, msg: "must contain email and password" })
            
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


module.exports.createUser = createUser
module.exports.loginUser = loginUser
