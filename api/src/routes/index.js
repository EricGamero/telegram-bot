const express = require('express')
const router = express.Router()

// el primer directorio es la url y la segunda el directorio del archivo
router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/faqs', require('./admin/faqs'))

module.exports = router
