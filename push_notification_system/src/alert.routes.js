const express = require('express');
const router = express.Router();
const AlertController = require('./alert.controller')


router.post('/send', AlertController.saveAndSendAlert)

module.exports = router;


