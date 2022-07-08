const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')

// CREATE BOOK
const createBook = async function (req, res) {
    try {

        let requestBody = req.body

        // BODY VALIDATION
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' }) 
        }

        // TITLE VALIDATION
        if (!validator.isValidField(requestBody.title)) {
            return res.status(400).send({ status: false, message: 'Book Title is required' })
        }

        if (!validator.isValidBookTitle(requestBody.title.trim())) {
            res.status(400).send({ status: false, message: `The book title is not valid` })
            return
        }
        // (title unique check)
        let titleCheck = await bookModel.findOne({ title: requestBody.title })
        if (titleCheck) {
            return res.status(400).send({ status: false, msg: "Title already exist" })
        }

        // EXCERPT VALIDATION
        if (!validator.isValidField(requestBody.excerpt)) {
            return res.status(400).send({ status: false, message: 'Excerpt is required' })
        }

        if (!validator.isValidExcerpt(requestBody.excerpt)) {
            return res.status(400).send({ status: false, message: 'Excerpt is in invalid format' })
        }

        // USER ID VALIDATION
        if (!validator.isValidField(requestBody.userId)) {
            return res.status(400).send({ status: false, message: 'User id is required' })
        }

        if (!validator.isValidObjectId(requestBody.userId)) {
            return res.status(400).send({ status: false, message: `${requestBody.userId} is not a valid user id` })
        }

        // ISBN VALIDATION
        if (!validator.isValidField(requestBody.ISBN)) {
            return res.status(400).send({ status: false, message: ' ISBN is required' })
        }

        //                    (isbn unique check)
        let ISBNCheck = await bookModel.findOne({ ISBN: requestBody.ISBN })
        if (ISBNCheck) {
            return res.status(400).send({ status: false, msg: "ISBN already exist" })
        }

        if (!validator.isValidISBN(requestBody.ISBN)) {
            return res.status(400).send({ status: false, message: ' ISBN is not in valid format' })
        }

        // CATEGORY VALIDATION
        if (!validator.isValidField(requestBody.category)) {
            return res.status(400).send({ status: false, message: 'Category is required' })
        }

        // SUBCATEGORY VALIDATION
        if (!validator.isValidField(requestBody.subcategory)) {
            return res.status(400).send({ status: false, message: 'Subcategory is required' })
        }

        // RELEASED AT VALIDATION
        if (!validator.isValidField(requestBody.releasedAt)) {
            res.status(400).send({ status: false, message: 'ReleasedAt is required' })
            return
        }
        if (!validator.isReleasedAt(requestBody.releasedAt)) {
            res.status(400).send({ status: false, message: `${requestBody.releasedAt} is not in valid format YYYY-MM-DD` })
            return
        }


        let savedBook1 = await bookModel.create(requestBody);
        res.status(201).send({ status: true, data: savedBook1 });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

// GET BOOKS BY QUERY
const getBooks = async function (req, res) {
    try {
    let data = req.query;
    let { userId, category, subcategory } = data;

    if (!validator.isValidRequestBody(data)) {
        return res.send({ msg: "field cannot be empty to get book collection!" })
    }
    
    // get books by filter
    let filter = { isDeleted: false, ...data };
    let findBook = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 }).sort({ title: 1 });
    if (findBook.length == 0) {
        return res.status(404).send({status: false, msg: "No Book found with given filter(s)"})
    } else {return res.send({ status: true, message: "Book List", data: findBook })}
    } 

    catch (error){
        return res.status(500).send({status: true, msg: error.message})
    }
}

// GET BOOKS BY ID
const getBooksById = async function (req, res) {
    try {
    let bookId = req.params.bookId;
    // bookId validation
    if (!validator.isValidField(bookId)) {
        return res.status(400).send({ msg: "book id is not present" })
    }
    if (!validator.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
    }
    // get books by id
    let book = await bookModel.findById(bookId, { isDeleted: false })
    let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false })
    reviews.reviewsData = reviews;

     return res.send({ status: true, msg:"Book List with Reviews", data: {book, reviewsData: reviews} })
    }
    catch (error){
        return res.status(500).send({status: true, msg: error.message})
    }
}

// UPDATE BOOK
const updateBook = async function (req, res) {

    try {
        let bookId = req.params.bookId
        let requestBody = req.body
        let { title, excerpt, releasedAt, ISBN } = requestBody

        // bookId validation
        if (!bookId) {
            return res.send({ msg: "book id is not present" })
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "invalid request" })
        }
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        // title validation
        const checkTitle = await bookModel.findOne({ title: requestBody.title, isDeleted: false })
        if (checkTitle) {
            return res.send({ status: false, msg: "title should be unique" })
        }
        if (!validator.isValidBookTitle(requestBody.title)) {
            return res.status(400).send({ status: false, message: `${requestBody.title} is not a valid title` })
        }
        if (!validator.isValidField(requestBody.title)) {
            return res.send({ status: false, msg: "title is required" })
        }

        // Isbn validation
        const checkISBN = await bookModel.findOne({ ISBN: requestBody.ISBN, isDeleted: false })
        if (checkISBN) {
            return res.send({ status: false, msg: "ISBN should be unique" })
        }
        if (!validator.isValidISBN(requestBody.ISBN)) {
            return res.status(400).send({ status: false, msg: `${requestBody.ISBN} is not a valid ISBN` })
        }
        
        // update book
        const updateBook = await bookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { $set: { ...requestBody } }, { new: true })
        return res.send({ status: true, msg: "book updated", data: updateBook })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

// DELETE BOOK BY ID
const deleteBook = async function (req, res) {
    let bookId = req.params.bookId

    // bookId validation
    if (!validator.isValidRequestBody(req.params)) {
        return res.send({ msg: "book id is not present" })
    }
    if (!bookId) {
        return res.send({ msg: "book id is not present" })
    }
    if (!validator.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: `${bookId} is not a valid user id` })
    }
    let bookDetails = await bookModel.findById(bookId)
    if (!bookDetails) {
        return res.send({ status: false, msg: "book id doesnt exist" })
    }
    // isDeleted updation
    if (bookDetails.isDeleted == false) {
        let deleted = await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.send({ status: true, msg: "deleted successfully" })
    } else {
        return res.send({ status: false, msg: "the book is already deleted" })
    }
}

module.exports = { getBooksById, createBook, getBooks, updateBook, deleteBook }