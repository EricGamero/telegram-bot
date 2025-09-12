// routes/customers.js  (CREACIÓN de la suscripción)
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/customer-controller.js')

router.post('/', controller.create) // POST /api/customers

module.exports = router
