// routes/customers.js  (CREACIÓN de la suscripción)
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/customer-controller.js')
const authCustomerCookie = require('../../middlewares/auth-customer-cookie.js')

router.post('/', controller.create)
router.get('/', authCustomerCookie, controller.findOne)

module.exports = router
