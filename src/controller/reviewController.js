const reviewModels = require('../model/reviewModel')
const bookModels = require('../model/bookModel')
const validator = require ("../validator/validator")
const mongoose = require('mongoose')  

const createReview = async function (req, res) {
  try {

    let bookId = req.params.bookId
    let data = req.body
    let { review, rating, reviewedBy } = data

    // BODY VALIDATION
    if (!validator.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: 'Requested field cannot be empty' })
    }

    // RATING VALIDATION
    if (!validator.isValidField(rating)) {
      return res.status(400).send({ status: false, message: 'Rating field cannot be empty' })
    }
    if (!validator.isValidRating(rating)) {
      return res.status(400).send({ status: false, message: 'rating should be between 0 to 5' })
    }

    //REVIEW VALIDATION
    if (!validator.isValidField(review)) {
      return res.status(400).send({ status: false, message: 'Review field cannot be empty' })
    }
    if (!validator.isValidReview(review)) {
      return res.status(400).send({ status: false, message: 'review length is not sufficient!  or  review is in invalid format!' })
    }

    // BOOK ID VALIDATION
    if (!bookId)
      return res.status(400).send({ status: false, msg: "Bad Request, please provide BookId in params" })

    let check = await bookModels.findOne({ _id: bookId, isDeleted: false })
    if (!check) {
      return res.status(404).send({ status: false, message: "No book found or deleted" })
    } else {

      data.reviewedAt = new Date()
      data.bookId = bookId
      data.reviewedBy = data.reviewedBy?data.reviewedBy:'Guest'
      let newReview = await bookModels.findOneAndUpdate({ _id: bookId }, { $inc: {review: 1},}, { new: true, upsert: true })
      let savedData = await reviewModels.create(data)
      newReview._doc["reviewData"] = savedData
      return res.status(201).send({ status: true, data: newReview })
    }
  }
  catch (error) {
    res.status(500).send({ status: false, msg: "error", err: error.message })
  }
}

module.exports.createReview=createReview

