const express = require("express");
const router = express.Router();
const govAuthController = require("./service.controller");

router.post('/signup',govAuthController.signUpController)
router.post('/signin',govAuthController.signInController)
router.post('/get-related-institutes',govAuthController.autoAssignInstituteController)
router.get('/get-all',govAuthController.getAllInstituteController)


module.exports = router;

