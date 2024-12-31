import { CohereEmbeddings } from '@langchain/cohere'

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
