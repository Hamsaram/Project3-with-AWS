const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validator = require("../validator/validator")

// CREATING USER PROFILE
const createUser = async function (req, res) {
    try {

        let requestBody = req.body

        // BODY VALIDATION
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' }) 
        }

        // TITLE VALIDATION
        if (!validator.isValidField(requestBody.title)) {
            return res.status(400).send({ status: false, message: 'title is required' }) 
        }

        if (!validator.isValidUserTitle(requestBody.title)) { 
            return res.status(400).send({ status: false, message: `Title should be among Mr, Mrs and Miss` }) 
        }

        // NAME VALIDATION
        if (!validator.isValidField(requestBody.name)) {
            return res.status(400).send({ status: false, message: 'name is required' })
        }

        if (!validator.isValidName(requestBody.name)) {
            return res.status(400).send({ status: false, message: "Please enter valid name " })
        }

        // PHONE VALIDATION
        if (!validator.isValidField(requestBody.phone)) {
            return res.status(400).send({ status: false, message: 'phone number is required' }) 
        }

        if (!validator.isValidMobile(requestBody.phone)) {
            return res.status(400).send({ status: false, message: `${requestBody.phone} is not valid` })
        }

        const isphoneAlreadyUsed = await userModel.findOne({ phone: requestBody.phone });
        if (isphoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${requestBody.phone} phone no. is already registered` })
        }

        // EMAIL VALIDATION
        if (!validator.isValidField(requestBody.email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
            
        }

        if (!(validator.isValidEmail(requestBody.email.trim()))) {   //change -- add trim() otherwise say invalid email
            return res.status(400).send({ status: false, message: `${requestBody.email} is not valid email` })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email: requestBody.email });
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${requestBody.email} email is already registered` })
        }

        // PASSWORD VALIDATION
        if (!validator.isValidField(requestBody.password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        if (!(requestBody.password.length >= 8 && requestBody.password.length <= 15)) {
            return res.status(400).send({ status: false, message: 'password length should be greter then 8 and less than 15' })
        }

        if (!validator.isValidPassword(requestBody.password)) {
            return res.status(400).send({ status: false, message: 'password should contain atleast 1 letter & 1 number' })
        }

        // ADDRESS VALIDATION
        if (Object.keys(requestBody.address).length === 0) {
            return res.status(400).send({ status: false, message: 'address cant be empty' })
        }

        if (requestBody.address) {
            // ADDRESS VALIDATION - STREET
            if (!validator.isValidField(requestBody.address.street)) {
                return res.status(400).send({ status: false, message: 'street is required' })
            }
            if (!validator.isValidStreet(requestBody.address.street)) {
                return res.status(400).send({ status: false, message: 'street name is in invalid format' })
            }
            
            // ADDRESS VALIDATION - CITY
            if (!validator.isValidField(requestBody.address.city)) {
                return res.status(400).send({ status: false, message: 'city is required' })
            }
            if (!validator.isValidName(requestBody.address.city)){
                return res.status(400).send({ status: false, message: 'Enter valid city name' })
            }

            // ADDRESS VALIDATION - PINCODE
            if (!validator.isValidField(requestBody.address.pincode)) {
                return res.status(400).send({ status: false, message: 'pincode is required' })
            }
            if (!validator.isValidPincode(requestBody.address.pincode)){
                return res.status(400).send({ status: false, message: 'Enter valid pincode' })
            }
        }

        let userSaved = await userModel.create(requestBody);
        res.status(201).send({ status: true, message: "user successfully created", data: userSaved });

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


// USER LOGGIN
const loginUser = async function (req, res) {
    try {

        let requestBody = req.body
        let { email, password } = requestBody

        if (!(requestBody.email)) {
            return res.status(400).send({ status: false, message: "Email is required!" })
        }
        if (!(requestBody.password)) {
            return res.status(400).send({ status: false, message: "Password is required!" })
        }

        if (!validator.isValidEmail(requestBody.email)) {
            return res.status(400).send({ status: false, message: "Email is not valid" })
        }

        if (!validator.isValidPassword(requestBody.password)) {
            return res.status(400).send({ status: false, message: "Password is not valid" })
        }

        let validUser = await userModel.findOne({ email: requestBody.email, password: requestBody.password });
        if (validUser == null) {
            return res.status(401).send({ status: false, message: "Email or Password is not correct" })
        }

        let payload = { userId: validUser._id, exp: Math.floor(Date.now() / 1000) + (100 * 60), iat: (Date.now() / 1000) }
        let token = jwt.sign(payload, 'project3')
        res.setHeader('x-api-key', token);
        res.status(200).send({ status: true, message: "user logged in successfully", data: { token, userId : validUser._id, exp: payload.exp, iat: payload.iat } })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createUser, loginUser }