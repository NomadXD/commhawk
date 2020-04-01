const express = require('express')
const router = express.Router()
const controller = require('./service.controller')

router.get('/create',controller.createUserController)


module.exports = router;
