const express = require('express')
const router = express.Router()

// el primer directorio es la url y la segunda el directorio del archivo
router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/event-categories', require('./admin/event-categories'))
router.use('/admin/promoters', require('./admin/promoters'))
router.use('/admin/spots', require('./admin/spots'))
router.use('/admin/promoter-spots', require('./admin/promoter-spots'))
router.use('/admin/email-errors', require('./admin/email-errors'))
router.use('/admin/sent-emails', require('./admin/sent-emails'))
router.use('/admin/emails', require('./admin/emails'))
router.use('/admin/images', require('./admin/images'))
router.use('/admin/languages', require('./admin/languages'))
router.use('/admin/towns', require('./admin/towns'))
router.use('/admin/events', require('./admin/events'))
router.use('/admin/event-prices', require('./admin/event-prices'))

module.exports = router
