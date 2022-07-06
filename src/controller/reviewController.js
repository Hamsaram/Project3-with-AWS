const reviewModels = require('../model/reviewModel')
const bookModels = require('../model/bookModel')
const mongoose = require('mongoose')  

const createReview = async function (req, res) {
  try {
    let requestBody = req.body

    let checkBookId = await bookModels.findOne({ _id: req.params.bookId, isDeleted: false })
    if (!checkBookId) {
      return res.status(404).send({ status: false, message: 'book does not exist' })
    }

    let bookDetail = await bookModels.findOneAndUpdate({ _id: req.params.bookId }, { reviews: checkBookId.reviews + 1 }, { new: true })
    requestBody.reviewedAt = new Date()
    requestBody.bookId = req.params.bookId
    requestBody.reviewedBy = requestBody.reviewedBy?requestBody.reviewedBy:'Guest';
    
    let create = await reviewModels.create(requestBody);
    const data = {
     _id:create._id , 
     bookId: create.bookId, 
     reviewedBy: create.reviewedBy, 
     reviewedAt: create.reviewedAt, 
     rating: create.rating, 
     review: create.review 

    }
     return res.status(201).send({ status: true, message: 'review created sucessfully', data:{...bookDetail.toObject(),review:data} })
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

module.exports.createReview=createReview