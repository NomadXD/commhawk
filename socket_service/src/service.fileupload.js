const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
//const config = require("../config");

aws.config.update({
  secretAccessKey: "3fIBVjYux3lsvtAyTEyS1FxaubNdTe+3ukhEnUVn",
  accessKeyId: "ASIATPIHHDYUAK2ETWYZ",
  region: "us-east-1",
  sessionToken:"FwoGZXIvYXdzEJ3//////////wEaDEpInGd7nRvdE9yIpCLNAQAS+Xt2QccGCBqY6s7KspHf92gG5FSlZC/xsM4Pk7WWVtW8aTxskOxdY8k+JAL2qg60FgDPEmvKeVOfdExFzCY3XrIzFCfrgbDDsV/lTmP95fez5GVuYtILnnA/jZsEL6ed7a2PlKm75lg/PwvyS4n3P4hcM5kG5s6CFbvJfVmACcBkgvmytUj9z7jqrSYJlB0j5CRuDyE4mHJJ30+sc15jISt1an73RIPVkYypfQBw31lx6Em8aPVl201BuWjXQ+IyNXaG3GvooBdNE88okNyJ9gUyLbWgLZ8TunYUI+dTT/Ud7gQHQ4ynUf4/4b0NI8syZJh/L3OPlE4tHFrb45BLcw=="
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
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;