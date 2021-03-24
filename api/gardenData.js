const { RDS } = require('aws-sdk');
var aws = require('aws-sdk');
const { response } = require('express');
var { pgClient } = require('../db/index.js'); 

let gardenLengths = {}

aws.config.update({
  region: 'ap-southeast-1',
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

const gardenData = app => {
  app.post('/api/studentdata', (req, response) => {   
    let text = `SELECT val_responsibility FROM students WHERE user_id = '${parseInt(req.body.user_id)}';`
    pgClient.query(text)
    .then(dbResponse => {
      gardenLengths.val_responsibility = dbResponse.rows[0].val_responsibility.length;
      response.status(200).json(dbResponse.rows[0])
    }).catch(e => {
      response.status(200).send({ ok: false });
      console.error(e.stack)
    })
  })

  app.post('/api/studentupload', (req, res) => {
    let uploadData = JSON.stringify({ text: req.body.text, img_key: gardenLengths.val_responsibility.length});
    // console.log('received upload data, is ', data)
    let uploadText = `UPDATE students SET val_responsibility = val_responsibility || ${uploadData}::jsonb WHERE user_id = ${req.body.user_id};`

    const s3 = new aws.S3();  // Create a new instance of S3
    const S3_BUCKET = process.env.sproutsbucket;
    const fileName = gardenLengths.val_responsibility.toString();
    const fileType = '.jpg';

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `${req.body.user_id}/temporary/${fileName}${fileType}`,
      Expires: 500,
      ContentType: fileType,
      ContentEncoding: 'base64',
      ACL: 'private',
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        res.json({success: false, error: err})
      }
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${req.body.user_id}/temporary/${fileName}`
      };
      // Send it all back
      res.json({success:true, data:{returnData}});
    });

    pgClient.query(uploadText)
    .then(response => {
      response.status(200).json()
    }).catch(e => {
      response.status(200).send({ ok: false });
      console.error(e.stack)
    })
  })

  app.post('/api/gardenimage', (req, res) => {
    console.log('garden image log', req.body.img_key);
    const s3 = new aws.S3();  // Create a new instance of S3
    const signedUrlExpireSeconds = 60 * 1

    var params = {
      Bucket: process.env.sproutsbucket, 
      Key: req.body.img_key, 
     };
     s3.getObject(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else {
         res.json({success: true, data: data.Body})
       }          
     });

    // s3.getSignedUrl('getObject', params, (err, data) => {
    //   if(err){
    //     console.log(err);
    //     res.json({success: false, error: err})
    //   } else {
    //     res.json({success: true, data: data.Body})
    //   }
    // })

  })
}
exports.gardenData = gardenData;