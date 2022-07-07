const mongoose = require('mongoose')

const isValidField = function (value){
    if ( typeof value === 'undefined'  || value === null) return false;
    if ( typeof value === 'string' && value.trim().length === 0 ) return false;
    if (typeof value === 'number') return false
    return true
}

// const isNumberValid = function (value){

// }

const isValidRequestBody = function (requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidMobile = function (mobile){
    return (/^[6-9]{1}[0-9]{9}$/.test(mobile))
}

const isValidEmail = function (email){
    return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
}

const isValidPassword = function (password){
    return (/[a-z A-Z 0-9]{4,16}$/.test(password))
}

const isValidObjectId = function(objectId) {             
    return mongoose.Types.ObjectId.isValid(objectId)
  }
  
const isValidName = function (name){
    return (/^[a-z A-Z ]{2,70}$/.test(name))
}
const isValidISBN = function (name){
    return (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(name))
}

module.exports= {isValidField,isValidRequestBody,isValidMobile, isValidEmail, isValidPassword, isValidObjectId, isValidName, isValidISBN  }