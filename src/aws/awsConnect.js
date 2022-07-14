const AWS = require("aws-sdk")

AWS.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

const uploadFile = async function ( file) {

   return new Promise( function(resolve, reject) {
 
    const s3= new AWS.S3({apiVersion: '2006-03-01'}); 

    const uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  
        Key: "abc/" + file.originalname,
        Body: file.buffer
    }

    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })
   })
}


module.exports = {uploadFile}