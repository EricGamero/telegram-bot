// src/routes/customer/search-bar.js
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/product-controller.js')

router.post('/search', controller.search)

module.exports = router
