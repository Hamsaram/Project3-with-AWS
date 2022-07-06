const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooks)
router.get("/books/:bookId", bookController.getBooksById)

router.post("/books/:bookId/review", reviewController.createReview)
 

module.exports=router