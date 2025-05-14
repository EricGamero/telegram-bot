const express = require('express')
const app = express()
const errorHandler = require('./middlewares/error-handler')
const routes = require('./routes')
const userAgentMiddleware = require('./middlewares/user-agent')
const userTrackingMiddleware = require('./middlewares/user-tracking')

app.use(userAgentMiddleware)
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userTrackingMiddleware)
// todo lo que va antes de (api, routes) se carga antes de llamar al enrutador
app.use('/api', routes)
app.use(errorHandler)
// todo lo que va después es cuando se termina la llamada/consulta
module.exports = app
