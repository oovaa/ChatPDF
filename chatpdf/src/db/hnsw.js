import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'

/**
 * Creates a vector store from the given documents using the specified embedding function.
 * @param {Array} doc - The documents to create the vector store from.
 * @param {Function} embedfunction - The embedding function to use for creating the vectors.
 * @param {Object} [param={}] - Additional parameters for the vector store creation.
 * @returns {Promise<HNSWLib>} A promise that resolves to the created vector store.
 */
export async function Hvectore(doc, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.fromDocuments(doc, embedfunction)
  return vectorStore
}
