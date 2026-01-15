const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  await subscriberClient.subscribe('new-customer', async (message) => {
    try {
      const data = JSON.parse(message)
      const emailService = new EmailService('gmail')
      await emailService.sendEmail(
        data,
        'customer',
        'activationUrl',
        { name: data.name }
      )
    } catch (error) {
      console.error('Error procesando mensaje:', error)
    }
  })
}
