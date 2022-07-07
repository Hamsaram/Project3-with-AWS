const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")
const reviewModel = require ("../model/reviewModel")
const mongoose = require('mongoose') 
 

// ================================================================================================================================================//

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  if (typeof value === 'number') return false
  return true;
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

// this validation to check object id type

const isValidObjectId = function(objectId) {             
  return mongoose.Types.ObjectId.isValid(objectId)
}

// third api to craete book  

const createBook = async function (req, res) {
       try {
     
         let requestBody = req.body
     
        //validation of request body and request body keys
     
         if (!isValidRequestBody(requestBody)) {
           return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
           
         }
     
         if (!isValid(requestBody.title)) {
           return res.status(400).send({ status: false, message: 'title is required' })
           
         }
     
         if (!isValid(requestBody.excerpt)) {
           return res.status(400).send({ status: false, message: ' excerpt is required' })
           
         }
         if (!isValid(requestBody.userId)) {   
           return res.status(400).send({ status: false, message: ' user id is required' })
           
         }
     
         if(!isValidObjectId(requestBody.userId)) {       
           return res.status(400).send({status: false, message: `${requestBody.userId} is not a valid user id`})
           
        }
     
         if (!isValid(requestBody.ISBN)) {
           return res.status(400).send({ status: false, message: ' ISBN is required' })
        
         }
     
         if (!isValid(requestBody.category)) {
           return res.status(400).send({ status: false, message: ' category is required' })
           
         }
     
         if (!isValid(requestBody.subcategory)) {
           return res.status(400).send({ status: false, message: ' subcategory is required' })
           
         }
     
         if (!isValid(requestBody.releasedAt)) {
           res.status(400).send({ status: false, message: ' releasedAt is required' })
           return
         }
     
         if(!(req.validToken._id == requestBody.userId)){
           return res.status(400).send({status:false,message:'unauthorized access'})
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
        let filter = { isDeleted: false, ...data};
        let findBook = await bookModel.find(filter).select({ _id: 1,title: 1,excerpt: 1,userId: 1,category: 1,releasedAt: 1,reviews: 1,}).sort({ title: 1 });
        res.send({ status: true, message: "Book List", data: findBook });
}

const getBooksById = async function (req,res){
    let bookId = req.params.bookId;
    let book = await bookModel.findById(bookId ,{isDeleted : false})
    let reviews = await reviewModel.find({bookId : bookId,isDeleted : false})
    reviews.reviewsData = reviews;
    return res.send({status : true , data : book, reviews})
}

module.exports.getBooksById = getBooksById
module.exports.createBook = createBook
module.exports.getBooks = getBooks