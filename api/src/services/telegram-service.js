const TelegramBot = require('node-telegram-bot-api')
const { broadcast } = require('./websocket-service')
const { PassThrough } = require('stream')
const fs = require('fs')
const https = require('https')
const { threadId } = require('worker_threads')

class TelegramService {
  constructor (telegramToken, groupId) {
    this.token = telegramToken
    this.groupId = parseFloat(groupId)
    this.bot = new TelegramBot(this.token, { polling: true })
    this.sessionAnchors = new Map()

    this.bot.on('message', (msg) => this.handleGroupMessage(msg))
  }

  async escalateToHuman (threadId, preview) {
    const text =
      `🆘 Nuevo caso [${threadId}]\n` +
      `Último mensaje: ${preview || '—'}\n` +
      'Responde a este mensaje con *reply* para contestar al usuario.'

    const sent = await this.bot.sendMessage(this.groupId, text, { parse_mode: 'Markdown' })
    this.sessionAnchors.set(sent.message_id, threadId)
  }

  async handleGroupMessage (msg) {
    try {
      if (msg.chat.id !== this.groupId) return
      if (!msg.reply_to_message) return

      const anchorId = msg.reply_to_message.message_id
      const threadId = this.sessionAnchors.get(anchorId)

      if (!threadId) return

      if (msg.voice) {
        await this.analyzeAudio(msg, threadId)
      }

      const message = msg.text || '(adjunto)'

      broadcast(threadId, {
        threadId,
        message
      })
    } catch (e) {
      console.log(e)
    }
  }

  async relayUserMessage (threadId, text) {
    const anchorId = [...this.sessionAnchors.entries()]
      .find(([anchor, tId]) => tId === threadId)?.[0]

    if (!anchorId) return

    await this.bot.sendMessage(this.groupId, `👤 Usuario: ${text}`, {
      reply_to_message_id: anchorId
    })
  }

  async analyzeAudio (msg, rhreadId) {
    const fileId = msg.voice.file_id
    const fileUrl = await this.bot.getFileLink(fileId)
    const fileStream = await this.downloadAudioAsStream(fileUrl, threadId)
    console.log(fileStream)
  }

  async downloadAudioAsStream (url) {
    return new Promise((resolve, reject) => {
      const stream = new PassThrough()
      const filePath = './tempAudio.oga'
      const fileStream = fs.createWriteStream(filePath)

      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(stream)
          stream.pipe(fileStream)

          fileStream.on('finish', () => {
            fileStream.close()
            resolve(fileStream)
          })
        } else {
          console.log('ERROR')
          reject(new Error(`Error al descargar el audio: ${response.statusCode}`))
        }
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
}

module.exports = TelegramService
