const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")
const reviewModel = require ("../model/reviewModel")

const createBook = async function (req, res) {
    try {
        let requestBody = req.body
        let savebook = await bookModel.create(requestBody)
        res.status(201).send({ status: true, msg: "Book successfully created", data: savebook })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

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