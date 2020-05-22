const express = require("express");
const router = express.Router();
const govAuthController = require("./service.controller");

router.post("/signup",govAuthController.signUpController);
router.post("/signin",govAuthController.signInController);
router.post("/get-related-institutes",govAuthController.autoAssignInstituteController);
router.get("/get-all",govAuthController.getAllInstituteController);
router.post("/get-institute-info",govAuthController.getInstituteInfoController);

router.get("/hq/get-unverified",govAuthController.getUnverifiedController);
router.get("/hq/verify/:instituteId", govAuthController.verifyHQController);


module.exports = router;

