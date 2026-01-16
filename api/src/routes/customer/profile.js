const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/auth-customer-controller.js')

router.get('/profile', controller.getProfile)

module.exports = router
