const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const multer = require('multer')
const app = express();
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())


const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://manish:iXN1zqLOlpx5PBN6@cluster0.cprui.mongodb.net/group37Database", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on cluster ✔'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port 🎧' + (process.env.PORT || 3000))
});