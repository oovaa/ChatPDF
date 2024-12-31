import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { CohereEmbeddings } from '@langchain/cohere'
import { doc_chuncker, parser } from '../utils/fileProcessing'

/**
 * Creates and returns a new instance of CohereEmbeddings with the specified configuration.
 *
 * @returns {CohereEmbeddings} A new instance of CohereEmbeddings configured with the provided API key, batch size, and model.
 *
 * @example
 * const embeddingsModel = ECohereEmbeddingsModel();
 * // Use embeddingsModel for embedding operations
 *
 * @see {@link https://docs.cohere.ai/reference/embeddings} for more information on Cohere Embeddings.
 */
export function ECohereEmbeddingsModel() {
  return new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
    batchSize: 48, // Default value if omitted is 48. Max value is 96
    model: 'embed-english-v3.0',
  })
}

/**
 * Generates embeddings for a given query string using the ECohereEmbeddingsModel.
 *
 * @param {string} str - The query string to be embedded.
 * @returns {Promise<any>} A promise that resolves to the embeddings of the query string.
 */
async function Cembed_Query(str) {
  const embeddings = ECohereEmbeddingsModel()
  return await embeddings.embedQuery(str)
}

// console.log(await Cembed_Query('hi there'))

async function Hvectore(doc, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.fromDocuments(doc, embedfunction())
  return vectorStore
}

const re = ECohereEmbeddingsModel()
// console.log(re)

const doc = await parser('./chatpdf/test.txt')
// console.log(doc)

const chunked = await doc_chuncker(doc)
// console.log(chunked)

// console.log(chunked.map((x) => x.pageContent))

// const embed = await re.embedDocuments(doc)
// console.log(embed)

const vectorStore = await Hvectore(chunked, ECohereEmbeddingsModel)

const document1 = {
  pageContent: 'The powerhouse of the cell is the mitochondria',
  metadata: { source: 'https://example.com' },
}

const document2 = {
  pageContent: 'Buildings are made out of brick',
  metadata: { source: 'https://example.com' },
}

const document3 = {
  pageContent: 'Mitochondria are made out of lipids',
  metadata: { source: 'https://example.com' },
}

const document4 = {
  pageContent: 'The 2024 Olympics are in Paris',
  metadata: { source: 'https://example.com' },
}

const documents = [document1, document2, document3, document4]

await vectorStore.addDocuments(documents)

const filter = (doc) => doc.metadata.source === 'https://example.com'

// const similaritySearchResults = await vectorStore.similaritySearch(
//   'aival',
//   2,
//   filter
// )

// for (const doc of similaritySearchResults) {
//   console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`)
// }

const directory = './testdb'
await vectorStore.save(directory)

// Load the vector store from the same directory
const loadedVectorStore = await HNSWLib.load(
  directory,
  new ECohereEmbeddingsModel()
)

// vectorStore and loadedVectorStore are identical
console.log(await loadedVectorStore.similaritySearch('Rain Boy', 1)) 
