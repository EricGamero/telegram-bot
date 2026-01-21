const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth/auth-customer-controller.js')

router.post('/check-signin', controller.signin)
router.post('/reset', controller.reset)
router.get('/check-signin', controller.checkSignin)

module.exports = router
