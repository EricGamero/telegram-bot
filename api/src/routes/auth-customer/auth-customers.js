const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth-customer/auth-customer-controller.js')
const authCustomerCookie = require('../../middlewares/auth-customer-cookie.js')

router.post('/check-signin', controller.signin)
router.post('/reset', controller.reset)
router.get('/check-signin', [authCustomerCookie], controller.checkSignin)
router.get('/profile', [authCustomerCookie], controller.getProfile)

module.exports = router
