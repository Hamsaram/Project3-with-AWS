const reviewModels = require('../model/reviewModel')
const bookModels = require('../model/bookModel')
const validator = require("../validator/validator")
const mongoose = require('mongoose')
const bookModel = require('../model/bookModel')

const createReview = async function (req, res) {
  try {

    let bookId = req.params.bookId
    let data = req.body
    let { reviews, rating, reviewedBy } = data

    // BODY VALIDATION
    if (!validator.isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: 'Requested field cannot be empty' })
    }
    // // REVIEWED VALIDATION
    // if (reviewedBy.length < 0) {
    //   return res.status(400).send({ status: false, message: 'ReviewedBy is required' })
    // }

    // RATING VALIDATION
    if (!validator.isValidField(rating)) {
      return res.status(400).send({ status: false, message: 'Rating field cannot be empty' })
    }
    if (!validator.isValidRating(rating)) {
      return res.status(400).send({ status: false, message: 'rating should be between 1 to 5' })
    }

    //REVIEW VALIDATION
    if (!validator.isValidField(reviews)) {
      return res.status(400).send({ status: false, message: 'Review field cannot be empty' })
    }
    if (!validator.isValidReview(reviews)) {
      return res.status(400).send({ status: false, message: 'review length is not sufficient!  or  review is in invalid format!' })
    }

    // BOOK ID VALIDATION
    if (!bookId)
      return res.status(400).send({ status: false, message: "Bad Request, please provide BookId in params" })
    if (!validator.isValidObjectId(bookId)) return res.status(400).send({status: false, message: "Book id is not valid"})

    let check = await bookModels.findOne({ _id: bookId, isDeleted: false })
    if (!check) {
      return res.status(404).send({ status: false, message: "No book found or deleted" })
    } else {

      data.reviewedAt = new Date()
      data.bookId = bookId
      data.reviewedBy = data.reviewedBy ? data.reviewedBy : 'Guest'
      let newReview = await bookModels.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true, upsert: true })
      let savedData = await reviewModels.create(data)
      newReview._doc["reviewData"] = savedData
      return res.status(201).send({ status: true, data: newReview })
    }
  }
  catch (error) {
    res.status(500).send({ status: false, message: "error", err: error.message })
  }
}


const updateReview = async function (req, res) {
  try {
  let bookId = req.params.bookId
  let reviewId = req.params.reviewId
  let data = req.body
  let { review, rating, reviewedBy } = data

  if (!validator.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "invalid request" })
  if (!validator.isValidFieldNumber(rating)) return res.status(400).send({ status: false, message: "invalid request for rating" })
  if (!validator.isValidRating(rating)) return res.status(400).send({ status: false, message: "rating must be from 1 to 5" })
  if (!validator.isValidField(reviewedBy)) return res.status(400).send({ status: false, message: "invalid request for reviewedBy" })

  if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
  if (!validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" })

  let book = await bookModels.findOne({ _id: bookId, isDeleted: false }).select({
    _id: 1,
    title: 1,
    excerpt: 1,
    userId: 1,
    ISBN: 1,
    category: 1,
    subcategory: 1,
    reviews: 1,
    isDeleted: 1,
    releasedAt: 1,
    createdAt: 1,
    updatedAt: 1,
  });
  if (book == null) return res.status(404).send({ status: false, message: "the book with this id doesnt exist or may have Deleted!" })

  let reviewExist = await reviewModels.findOne({ _id: reviewId, isDeleted: false })
  if (reviewExist == null) return res.status(404).send({ status: false, message: "the review with this id doesnt exist! or it has been Deleted!" })

  let updateReview = await reviewModels.findOneAndUpdate({ _id: reviewId }, data, { new: true })
  book._doc['reviewData'] = updateReview
  return res.status(200).send({ status: true, message: "the review is updated successfully", data: book })
} catch (error){
  res.status(500).send({ status: false, message: "error", err: error.message })
}
}

const deleteReview = async function (req, res) {
  try {
  let bookId = req.params.bookId
  let reviewId = req.params.reviewId

  if (!validator.isValidField(bookId)) return res.send(400).send({ status: false, message: "bookId is required" })
  if (!validator.isValidField(reviewId)) return res.send(400).send({ status: false, message: "reviewId is required" })

  if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
  if (!validator.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" })

  let bookExist = await bookModels.findOne({ _id: bookId, isDeleted: false })
  if (bookExist == null) return res.status(404).send({ status: false, message: "the book with this id doesnt exist or may have Deleted!" })

  let reviewExist = await reviewModels.findOne({ _id: reviewId, isDeleted: false })
  if (reviewExist == null) return res.status(404).send({ status: false, message: "the review with this id doesnt exist! or it has been Deleted!" })

  const reviewDeleted = await reviewModels.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true });
  bookExist.reviews = bookExist.reviews === 0 ? 0 : bookExist.reviews - 1
  await bookExist.save()
  return res.status(200).send({ status: true, message: "review deleted successfully" });
  } catch {
    res.status(500).send({ status: false, message: "error", err: error.message })
  }
}

module.exports = { createReview, updateReview, deleteReview }


