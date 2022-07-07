const reviewModels = require('../model/reviewModel')
const bookModels = require('../model/bookModel')
const validator = require ("../validator/validator")
const mongoose = require('mongoose')  

const createReview = async function (req, res) {
  try {
    let requestBody = req.body
    if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({ status: false, message: 'Invalid request parameters.' })
    }

    let checkBookId = await bookModels.findOne({ _id: req.params.bookId, isDeleted: false })
    if (!checkBookId) {
      return res.status(404).send({ status: false, message: 'book does not exist' })
    }

    let bookDetail = await bookModels.findOneAndUpdate({ _id: req.params.bookId }, { reviews: checkBookId.reviews + 1 }, { new: true }).select({__v:0})
    requestBody.reviewedAt = new Date()
    requestBody.bookId = req.params.bookId
    requestBody.reviewedBy = requestBody.reviewedBy?requestBody.reviewedBy:'Guest';
    
    let create = await reviewModels.create(requestBody);
    let data = await reviewModels.findOne({bookId: req.params.bookId}).select({__v:0, isDeleted:0})
     return res.status(201).send({ status: true, message: 'review created sucessfully', data:{...bookDetail.toObject(),review:data} }) //or bookDetail._doc
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
}

module.exports.createReview=createReview

