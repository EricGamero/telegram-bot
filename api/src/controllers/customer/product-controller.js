const { ChromaClient } = require('chromadb')
const OpenAIService = require('../../services/openai-service')

const client = new ChromaClient({ persistDirectory: './db' })
const openaiService = new OpenAIService() // instancia

exports.search = async (req, res) => {
  try {
    const { query } = req.body
    if (!query || query.length < 5) {
      return res.status(400).json({ results: [] })
    }

    const collection = await client.getOrCreateCollection({ name: 'products' })

    // Usamos el servicio de OpenAI para generar embedding
    const queryEmbedding = await openaiService.getEmbedding(query)

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5
    })

    // Solo log con distancia para depuración
    console.log('--- RESULTADOS CHROMA [PRODUCTS] ---')
    if (results.documents && results.documents[0]) {
      results.documents[0].forEach((text, i) => {
        const id = results.ids?.[0]?.[i] || 'N/A'
        const distance = results.distances?.[0]?.[i] || 'N/A'
        console.log(`→ [${i + 1}] ID: ${id} | DISTANCIA: ${distance}`)
        console.log(`   TEXTO: ${text}`)
        console.log('-----------------------------')
      })
    }

    const formatted = (results.documents[0] || []).map((text, i) => ({
      id: results.ids?.[0]?.[i] || null,
      text,
      metadata: results.metadatas?.[0]?.[i] || {}
    }))

    res.json({ results: formatted })
  } catch (err) {
    console.error('Error en ProductController.search:', err)
    res.status(500).json({ results: [] })
  }
}
