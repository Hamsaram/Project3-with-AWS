const reviewModels = require('../model/reviewModel')
const bookModels = require('../model/bookModel')
const validator = require ("../validator/validator")
const mongoose = require('mongoose')  

const createReview = async function (req, res) {
  try {

    
    let requestBody = req.body
    let {reviewedBy, rating, review} = requestBody

    // BODY VALIDATION
    if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({ status: false, message: 'Requested field cannot be empty' })
    }

    // RATING VALIDATION
    if (!validator.isValidField(requestBody.rating)){
      return res.status(400).send({ status: false, message: 'Rating field cannot be empty' })
    }
    if (!validator.isValidRating(requestBody.rating)){
      return res.status(400).send({ status: false, message: 'rating should be between 0 to 5' })
    }

    //REVIEW VALIDATION
    if (!validator.isValidField(requestBody.review)){
      return res.status(400).send({ status: false, message: 'Review field cannot be empty' })
    }
    if  (!validator.isValidReview(requestBody.review)){
      return res.status(400).send({ status: false, message: 'review length is not sufficient!  or  review is in invalid format!' })
    }

    let checkBookId = await bookModels.findOne({ _id: req.params.bookId, isDeleted: false })
    if (!checkBookId) {
      return res.status(404).send({ status: false, message: 'Book does not exist!  or  May have deleted!' })
    }

    let bookDetail = await bookModels.findOneAndUpdate({ _id: req.params.bookId }, { reviews: checkBookId.reviews + 1 },{ new: true })
    requestBody.reviewedAt = new Date()
    requestBody.bookId = req.params.bookId
    requestBody.reviewedBy = requestBody.reviewedBy?requestBody.reviewedBy:'Guest';
    
    let create = await reviewModels.create(requestBody);
    let data = await reviewModels.findOne({bookId: req.params.bookId})
     return res.status(201).send({ status: true, message: 'review created sucessfully', data:{...bookDetail.toObject(),review:data} }) //or bookDetail._doc
     
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
}

module.exports.createReview=createReview

