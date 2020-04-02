const express = require('express')
const router = express.Router()
const controller = require('./service.controller')

router.post('/signup',controller.signUpUserController)
router.post('/signin',controller.signInUserController)
router.put('/update',controller.updateUserController)
router.delete('/delete',controller.deleteUserController)
router.get('/:userId',controller.getUserController)

module.exports = router;
