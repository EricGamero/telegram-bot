const express = require('express')
const app = express()
const errorHandler = require('./middlewares/error-handler')
const routes = require('./routes')
const userAgentMiddleware = require('./middlewares/user-agent')

app.use(userAgentMiddleware)
app.use(express.json({ limit: '10mb', extended: true }))

app.use('/api', routes)
app.use(errorHandler)

module.exports = app
