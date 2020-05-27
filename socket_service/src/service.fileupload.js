const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
//const config = require("../config");

aws.config.update({
  secretAccessKey: "NWAroHc/EDj4ltch77KR0rtV7tXN2C+i1qFnuHI1",
  accessKeyId: "ASIATPIHHDYUGJDZLTFK",
  region: "us-east-1",
  sessionToken: "FwoGZXIvYXdzEG8aDJ0bp+d4onDtKsQ6qyLNAamwQDSIFAcDliq8lKzMqPfVDCrgsgMGeUr5GFNHzDSURpyA02EsVjp1xbjkFoHBGzPP+foCS4TrmrdJpzhWr6TW6UacLhdO9efAPbfYLkLLDdt5LcskPCpgrxvHI6bFM30VBfV/5qADlbN8qAQgKmo9NaGaHtCB7w+4tomO/Mvj1BpBWLvsOMlcUYqmd069IN1NzWYwEDeB8FoQbX/1ZcgbcrfVy2sGSGLUe/Y0GFh/slWRhjhcJorYICe1Q3XneHRN1Dph1sfYSgJbH7so7fW39gUyLVfmma7LK6gShf2Pf+XRMzC61yFGPR57jOZ+AD5bDQu7ym8fwxdodb9I8q6qHw=="
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