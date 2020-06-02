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
router.post("/hq/analytics/token", govAuthController.analyticsTokenController);
router.post("/hq/analytics/date", govAuthController.analyticsDateController);
router.post("/hq/analytics/province", govAuthController.analyticsProvinceController);
router.post("/hq/analytics/day", govAuthController.analyticsDayController);

module.exports = router;

