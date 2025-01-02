import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { ECohereEmbeddingsModel } from '../embed/Ecohere'
import { parser } from '../utils/fileProcessing'
import { doc_chuncker } from '../utils/chunker'

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

/**
 * Stores a file in the vector database (VDB).
 *
 * This function takes a file path, processes the file to extract embeddings,
 * and stores the resulting vectors in the vector database.
 *
 * @param {string} filePath - The path to the file to be stored in the VDB.
 * @returns {romise<HNSWLib>} - A promise that resolves when the file has been successfully stored.
 */
export const StoreFileInVDB = async (filePath) => {
  const Embeddings = ECohereEmbeddingsModel()

  const load = await parser(filePath)

  const chunk = await doc_chuncker(load)

  const vdb = await Hvectore(chunk, Embeddings)
  return vdb
}
