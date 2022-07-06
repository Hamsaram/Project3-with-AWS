const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")

const createBook = async function (req, res) {
    try {
        let requestBody = req.body
        let savebook = await bookModel.create(requestBody)
        res.status(201).send({ status: true, msg: "Book successfully created", data: savebook })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
  const getBooks = async function (req,res){
            let data = {
                userId : req.query.userId,
                category: req.query.category,
                subcategory: req.query.subcategory
            }
        
            const book = await bookModel.find({ $and: [{isDeleted: false}, data]}).select({_id: 1, title:1, excerpt: 1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1})
            return res.send({status: true, data: book})
        }
        
      


module.exports.createBook = createBook
module.exports.getBooks = getBooks