import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { VectorStore, VectorStoreRetriever } from '@langchain/core/vectorstores'
import { VDB } from './hnsw.js'

/**
 *
 * Retrieves documents from the VectorStore.
 *
 * @param {VectorStore} VectorStore - The vector store instance to retrieve documents from.
 * @param {number} [Kdocs=5] - The number of documents to retrieve. Defaults to 5.
 * @returns {VectorStoreRetriever<HNSWLib>} A promise that resolves to the retrieved documents.
 */
export const Retriver = (VectorStore, Kdocs = 10) => {
  return retriever(Kdocs)
}

/**
 * Retrieves similarities based on the given question and vector store.
 *
 * @param {string} question - The question to find similarities for.
 * @param {HNSWLib} VectorStore - A promise that resolves to the created vector store.
 */
/**
 * Retrieves the similarities for a given question using the provided VectorStore.
 *
 * @param {string} question - The question to retrieve similarities for.
 * @param {Object} VectorStore - The vector store to use for retrieving similarities.
 * @returns {Promise<string>} A promise that resolves to an array of strings representing the first character of the page content of each chunk.
 */
export const getSemiliraties = async (question, VectorStore) => {
  const retriver = Retriver(VectorStore)
  const chunks = await retriver.invoke(question)
  const result = chunks.map((x) => x.pageContent)
  return result.join('\n\n')
}

/**
 * The retriever object used for retrieving data from the VectorStore.
 * @returns {Promise<any>} - The retriever object.
 */
export async function retriever() {
  if (!VDB) throw new Error('No vector database')

  const vstore = VDB
  const retriever = vstore.asRetriever()
  return retriever
}

/**
 * Combines the page content of multiple documents into a single string.
 *
 * @param {Array} docs - An array of document objects.
 * @param {Object} docs[].pageContent - The content of a single document page.
 * @returns {string} A single string containing the combined page content of all documents, separated by double newlines.
 */
export function combine(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n')
}
