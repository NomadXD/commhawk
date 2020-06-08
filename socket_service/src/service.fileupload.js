const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
//const config = require("../config");

aws.config.update({
  secretAccessKey: process.env.SECRET_ACESS_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: "us-east-1",
  sessionToken: process.env.SESSION_TOKEN
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "commhawk",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "TESTING_METADATA"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+"/"+file.originalname);
    }
  })
});

module.exports = upload;