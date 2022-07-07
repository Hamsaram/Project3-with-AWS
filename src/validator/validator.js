const mongoose = require('mongoose')

const isValidField = function (value) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    if (typeof value === 'number') return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidMobile = function (mobile) {
    return (/^[6-9]{1}[0-9]{9}$/.test(mobile.trim()))
}

const isValidEmail = function (email) {
    return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.trim()))
}

const isValidPassword = function (password) {
    return (/[a-z A-Z 0-9]{4,16}$/.test(password.trim()))
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidName = function (name) {
    return (/^[a-z A-Z ]{2,30}$/.test(name.trim()))
}

const isValidExcerpt = function (excerpt) {
    return (/^[a-z A-Z ]{2,100}$/.test(excerpt.trim()))
}

const isValidISBN = function (isbn) {
    return (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn.trim()))
}

const isValidUserTitle = function (title) {
    return (/^(Mrs.|Mr.|Miss).?[A-z]$/.test(title))
}

const isValidBookTitle = function (value) {
    return (/^[a-z A-Z ]{2,70}$/.test(value.trim()))
}

module.exports = { isValidField, isValidRequestBody, isValidMobile, isValidEmail, isValidPassword, isValidObjectId, isValidName, isValidISBN, isValidUserTitle, isValidBookTitle, isValidExcerpt }