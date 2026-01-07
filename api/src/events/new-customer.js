const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer') {
      const data = JSON.parse(message)
      const emailService = new EmailService('gmail')

      emailService.sendEmail(data, 'user', 'activationTelegramBot', { name: data.name })
    }
  })
}
