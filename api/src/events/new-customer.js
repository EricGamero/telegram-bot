const AuthorizationService = require('../services/authorization-service')
const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  await subscriberClient.subscribe('new-customer', async (message) => {
    try {
      const data = JSON.parse(message)

      const sequelizeDb = require('../models/sequelize')
      const BotVerification = sequelizeDb.BotVerification

      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(data.id, 'customer')

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      await BotVerification.create({
        email: data.email,
        verificationCode
      })

      const Bot = sequelizeDb.Bot
      const bot = await Bot.findOne()
      const botName = bot

      const emailService = new EmailService('gmail')
      await emailService.sendEmail(
        data,
        'customer',
        'activationUrl',
        { name: data.name, activationUrl, verificationCode, botName }
      )
    } catch (error) {
      console.error('Error procesando mensaje:', error)
    }
  })
}
