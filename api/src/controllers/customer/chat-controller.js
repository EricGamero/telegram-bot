const mongooseDb = require('../../models/mongoose')
const Chat = mongooseDb.Chat
const OpenAIService = require('../../services/openai-service')
const { searchProducts } = require('../../services/chroma-service') // NUEVO

// =================== GET CHAT ===================
exports.getChat = async (req, res) => {
  try {
    const threadId = req.params.threadId
    const chat = await Chat.findOne({ threadId }).lean().exec()

    if (chat) {
      const response = chat.messages.map(message => {
        return {
          role: message.role,
          content: message.content[0].text.value
        }
      })
      res.status(200).send(response)
    } else {
      res.status(404).send({ message: 'Chat no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error al obtener el chat' })
  }
}

// =================== ASSISTANT RESPONSE ===================
exports.assistantResponse = async (req, res) => {
  try {
    const openai = new OpenAIService()
    const prompt = req.body.prompt
    let escalateToHuman = false

    // Crear o usar thread
    if (req.body.threadId) {
      await openai.setThread(req.body.threadId)
    } else {
      await openai.createThread()
    }
    await openai.setAssistant(process.env.OPENAI_ASSISTANT_CHATBOT_ID)

    // ------------------- Buscar productos en Chroma -------------------
    const products = await searchProducts(prompt)

    // Limpiar URLs y texto de los productos
    const cleanProducts = products.map(p => {
      const url = p.url || ''
      let name = p.name || ''
      // Si el nombre viene en <a href=...>, extraer solo el texto
      const match = name.match(/<a[^>]*>([^<]+)<\/a>/)
      if (match) name = match[1]
      return {
        text: p.newDescription || p.description || '',
        productName: name,
        productUrl: url.startsWith('http') ? url : `https://mobel6000.com${url}`
      }
    })

    // Preparar prompt para OpenAI usando solo texto limpio y URLs externas
    const fullPrompt = `Usuario preguntó: "${prompt}". Productos relevantes: ${JSON.stringify(cleanProducts)}`

    await openai.createMessage(fullPrompt)
    await openai.runStatus()

    // Revisar si hay herramientas que escalen a humano
    if (openai.tools) {
      const toolsOutputs = []
      for (const tool of openai.tools) {
        const data = JSON.parse(tool.function.arguments)
        if (tool.function.name === 'escalate_to_human_due_to_user_behavior' || tool.function.name === 'escalate_to_human_no_answer') {
          const fn = tool.function.name === 'escalate_to_human_due_to_user_behavior'
            ? exports.escalateToHumanUserBehavior
            : exports.escalateToHumanNoAnswer
          await fn(req, data.conversationContext, openai.threadId)
          escalateToHuman = true
          toolsOutputs.push({
            tool_call_id: tool.id,
            output: 'Un humano se va a incorporar a la conversación para resolver la consulta del usuario.'
          })
        }
      }
      if (toolsOutputs.length > 0) await openai.submitToolOutputs(toolsOutputs)
    }

    // Guardar en Mongo
    const chat = await Chat.findOne({ threadId: openai.threadId })
    if (chat) {
      chat.messages = openai.messages
      chat.run = openai.run
      chat.markModified('messages')
      chat.markModified('run')
      await chat.save()
    } else {
      await Chat.create({
        assistantEndpoint: process.env.OPENAI_ASSISTANT_CHATBOT_ID,
        threadId: openai.threadId,
        run: openai.run,
        messages: openai.messages,
        deletedAt: null
      })
    }

    // Obtener respuesta del asistente y asegurarse que tenga el formato correcto
    let answer = openai.answer
    try { answer = JSON.parse(openai.answer) } catch (_) {}

    // Si OpenAI no devuelve los campos, rellenar con el primer producto de Chroma
    if (!answer || !answer.text) {
      const first = cleanProducts[0] || { text: '', productName: '', productUrl: '' }
      answer = {
        text: first.text,
        productName: first.productName,
        productUrl: first.productUrl
      }
    }

    res.status(200).send({
      threadId: openai.threadId,
      escalateToHuman,
      answer
    })
  } catch (error) {
    console.error('Error en assistantResponse:', error)
    res.status(500).send({ message: 'Error al obtener el chat' })
  }
}

// =================== RELAY USER MESSAGE ===================
exports.relayUserMessage = async (req, res) => {
  try {
    const { message, threadId } = req.body
    console.log('Reenviando mensaje humano:', { message, threadId })

    if (req.telegramService && typeof req.telegramService.relayUserMessage === 'function') {
      await req.telegramService.relayUserMessage(threadId, message)
      res.status(200).send({ message: 'Mensaje reenviado al humano con éxito' })
    } else {
      console.warn('⚠️ req.telegramService no disponible, simulando envío')
      res.status(200).send({ message: 'Simulado: mensaje reenviado al humano' })
    }
  } catch (error) {
    console.error('Error en relayUserMessage:', error)
    res.status(500).send({ message: 'Error al reenviar mensaje al humano' })
  }
}

// =================== ESCALATE TO HUMAN (USER BEHAVIOR) ===================
exports.escalateToHumanUserBehavior = async (req, conversationContext, threadId) => {
  try {
    console.log('➡️ Escalando a humano (comportamiento):', conversationContext)
    if (req.telegramService && typeof req.telegramService.escalateToHumanUserBehavior === 'function') {
      await req.telegramService.escalateToHumanUserBehavior(conversationContext, threadId)
    } else {
      console.warn('⚠️ No se encontró telegramService para escalateToHumanUserBehavior')
    }
  } catch (error) {
    console.error('Error en escalateToHumanUserBehavior:', error)
  }
}

// =================== ESCALATE TO HUMAN (NO ANSWER) ===================
exports.escalateToHumanNoAnswer = async (req, conversationContext, threadId) => {
  try {
    console.log('➡️ Escalando a humano (sin respuesta):', conversationContext)
    if (req.telegramService && typeof req.telegramService.escalateToHumanNoAnswer === 'function') {
      await req.telegramService.escalateToHumanNoAnswer(conversationContext, threadId)
    } else {
      console.warn('⚠️ No se encontró telegramService para escalateToHumanNoAnswer')
    }
  } catch (error) {
    console.error('Error en escalateToHumanNoAnswer:', error)
  }
}
