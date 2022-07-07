const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")

// USER API
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

// BOOK API
router.post("/books",bookController.createBook)
router.post("/books/:bookId/review", reviewController.createReview)
router.get("/books",bookController.getBooks)
router.get("/books/:bookId", bookController.getBooksById)
router.put("/books/:bookId", bookController.updateBook)
router.delete("/books/:bookId", bookController.deleteBook)

module.exports=router