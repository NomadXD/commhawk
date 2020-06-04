const express = require('express');
const router = express.Router();
const ServiceController = require('./service.controller')

router.post('/send', ServiceController.saveAndSendAlert)
router.post('/send-all', ServiceController.saveAndSendAll)
router.post('/save-location', ServiceController.saveLocation)
router.post('/get-messages', ServiceController.getMessages)

module.exports = router;