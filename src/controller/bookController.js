const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')
const { findOne } = require("../model/userModel")


// ================================================================================================================================================//




// this validation to check object id type


// third api to craete book  

const createBook = async function (req, res) {
    try {

        let requestBody = req.body

        //validation of request body and request body keys

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })

        }

        if (!validator.isValidField(requestBody.title)) {
            return res.status(400).send({ status: false, message: 'title is required' })

        }

        if (!validator.isValidField(requestBody.excerpt)) {
            return res.status(400).send({ status: false, message: ' excerpt is required' })

        }
        if (!validator.isValidField(requestBody.userId)) {
            return res.status(400).send({ status: false, message: ' user id is required' })

        }

        if (!validator.isValidObjectId(requestBody.userId)) {
            return res.status(400).send({ status: false, message: `${requestBody.userId} is not a valid user id` })
        }

        if (!validator.isValidField(requestBody.ISBN)) {
            return res.status(400).send({ status: false, message: ' ISBN is required' })

        }

        if (!validator.isValidField(requestBody.category)) {
            return res.status(400).send({ status: false, message: ' category is required' })

        }

        if (!validator.isValidField(requestBody.subcategory)) {
            return res.status(400).send({ status: false, message: ' subcategory is required' })

        }

        if (!validator.isValidField(requestBody.releasedAt)) {
            res.status(400).send({ status: false, message: ' releasedAt is required' })
            return
        }

        if (!(req.validToken._id == requestBody.userId)) {
            return res.status(400).send({ status: false, message: 'unauthorized access' })
        }

        //  check user id exist or not 

        let userCheck = await userModel.findOne({ _id: requestBody.userId })
        if (!userCheck) {
            return res.status(400).send({ status: false, msg: "user dosnt exis with this user id" })
        }

        // unique check  title and isbn is already exist or not 

        let titleCheck = await bookModel.findOne({ title: requestBody.title })
        if (titleCheck) {
            return res.status(400).send({ status: false, msg: "title already exist" })
        }

        let ISBNCheck = await bookModel.findOne({ ISBN: requestBody.ISBN })
        if (ISBNCheck) {
            return res.status(400).send({ status: false, msg: "ISBN already exist" })
        }

        // sucessfully save data in datbase

        let savedBook1 = await bookModel.create(requestBody);

        res.status(201).send({ status: true, data: savedBook1 });

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message });

    }
};


const getBooks = async function (req, res) {
    let data = req.query;
    let { userId, category, subcategory } = data;
    let filter = { isDeleted: false, ...data };
    let findBook = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, }).sort({ title: 1 });
    res.send({ status: true, message: "Book List", data: findBook });
}

const getBooksById = async function (req, res) {
    let bookId = req.params.bookId;
    let book = await bookModel.findById(bookId, { isDeleted: false })
    let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false })
    reviews.reviewsData = reviews;
    return res.send({ status: true, data: book, reviews })
}


const updateBook = async function (req, res) {

    try {
        let bookId = req.params.bookId
        let requestBody = req.body
        let { title, excerpt, releasedAt, ISBN } = requestBody
        if (!bookId) {
            return res.send({ msg: "book id is not present" })
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "invalid request" })
        }

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid user id` })
        }

        const checkTitle = await bookModel.findOne({ title: requestBody.title, isDeleted: false })
        if (checkTitle) {
            return res.send({ status: false, msg: "title should be unique" })
        }
        if (!validator.isValidName(requestBody.title)) {
            return res.status(400).send({ status: false, message: `${requestBody.title} is not a valid title` })
        }
        if (!validator.isValidField(requestBody.title)) {
            return res.send({ status: false, msg: "title is required" })
        }

        const checkISBN = await bookModel.findOne({ ISBN: requestBody.ISBN, isDeleted: false })
        if (checkISBN) {
            return res.send({ status: false, msg: "ISBN should be unique" })
        }
        if (!validator.isValidISBN(requestBody.ISBN)) {
            return res.status(400).send({ status: false, msg: `${requestBody.ISBN} is not a valid ISBN` })
        }

        const updateBook = await bookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { $set: { ...requestBody } }, { new: true })
        return res.send({ status: true, msg: "book updated", data: updateBook })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

const deleteBook = async function (req, res) {
    let bookId = req.params.bookId

    if (!validator.isValidRequestBody(req.params)) {
        return res.send({ msg: "book id is not present 88888" })
    }

    if (!bookId){
        return res.send({ msg: "book id is not present" })
    }

    if (!validator.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: `${bookId} is not a valid user id` })
    }

    let bookDetails = await bookModel.findById(bookId)
    if (!bookDetails) {
        return res.send({ status: false, msg: "book id doesnt exist" })
    }

    if (bookDetails.isDeleted == false) {
        let deleted = await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.send({ status: true, msg: "deleted successfully" })
    } else {
        return res.send({ status: false, msg: "the book is already deleted" })
    }
}

module.exports = { getBooksById, createBook, getBooks, updateBook, deleteBook }