const express = require('express');
const router = express.Router();
const ServiceController = require('./service.controller')

router.post('/send', ServiceController.saveAndSendAlert)
router.post('/sendAll', ServiceController.saveAndSendAll)
router.post('/saveLocation', ServiceController.saveLocation)
router.post('/getMessages', ServiceController.getMessages)

module.exports = router;