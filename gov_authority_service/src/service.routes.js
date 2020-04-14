const express = require("express");
const router = express.Router();
const govAuthController = require("./service.controller");

router.post('/signup',govAuthController.signUpController)
router.post('/signin',govAuthController.signInController)


module.exports = router;

