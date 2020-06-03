const express = require("express");
const router = express.Router();
const govAuthController = require("./service.controller");

router.post("/signup",govAuthController.signUpController);
router.post("/signin",govAuthController.signInController);
router.post("/get-related-institutes",govAuthController.autoAssignInstituteController);
router.get("/get-all",govAuthController.getAllInstituteController);
router.post("/get-institute-info",govAuthController.getInstituteInfoController);
router.post("/update/contact",govAuthController.updateInstituteContactController);
router.post("/update/location", govAuthController.updateInstituteLocationController);
router.post("/update/info", govAuthController.updateInstituteInfoController);
router.post("/update/change-password", govAuthController.changePasswordController);

router.get("/hq/get-unverified",govAuthController.getUnverifiedController);
router.get("/hq/verify/:instituteId", govAuthController.verifyHQController);
router.post("/analytics/token", govAuthController.analyticsTokenController);
router.post("/analytics/date", govAuthController.analyticsDateController);
router.post("/analytics/province", govAuthController.analyticsProvinceController);
router.post("/analytics/day", govAuthController.analyticsDayController);
router.post("/analytics", govAuthController.analyticsController);

module.exports = router;

