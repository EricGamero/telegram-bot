const express = require('express')
const router = express.Router()

// el primer directorio es la url y la segunda el directorio del archivo

// Rutas de Admin
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
router.use('/admin/feature-titles', require('./admin/feature-titles'))
router.use('/admin/cards', require('./admin/cards'))
router.use('/admin/heroes', require('./admin/heroes'))
router.use('/admin/subscription-forms', require('./admin/subscription-forms'))
router.use('/admin/spots', require('./admin/spots'))
// Rutas de Customer
router.use('/customer/cards', require('./customer/cards'))
router.use('/customer/heroes', require('./customer/heroes'))
router.use('/customer/feature-titles', require('./customer/feature-titles'))
router.use('/customer/faqs', require('./customer/faqs'))
router.use('/customer/subscription-forms', require('./customer/subscription-forms'))
router.use('/customer/customers', require('./customer/customers'))
router.use('/customer/chats', require('./customer/chats'))
router.use('/customer/products', require('./customer/products'))
router.use('/customer/customers', require('./customer/customers'))
// Rutas de Auth

router.use('/auth', require('./auth/auth-activate'))
router.use('/auth/user', require('./auth/auth-users'))
router.use('/auth/customer', require('./auth/auth-customers'))

module.exports = router
