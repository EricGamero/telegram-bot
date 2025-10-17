const { ChromaClient } = require('chromadb')
const OpenAI = require('openai')
require('dotenv').config()

const client = new ChromaClient({ persistDirectory: './db' })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function searchProducts (query, limit = 2) {
  const collection = await client.getOrCreateCollection({ name: 'products' })

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  })

  const queryEmbedding = embeddingResponse.data[0].embedding

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit,
    include: ['metadatas']
  })

  return results.metadatas[0].map(item => ({
    name: item.name,
    description: item.text.length > 200 ? item.text.slice(0, 200) + '…' : item.text
  }))
}

module.exports = { searchProducts }
