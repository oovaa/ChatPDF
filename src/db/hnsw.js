import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { ECohereEmbeddingsModel } from '../models/Ecohere'
import { parser } from '../utils/fileProcessing'
import { doc_chuncker } from '../utils/chunker'

/**
 * Initializes a vector database (VDB) using HNSWLib from an empty set of documents
 * and an instance of ECohereEmbeddingsModel.
 *
 * @constant {Promise<HNSWLib>} VDB - The initialized vector database.
 */
export let VDB = await HNSWLib.fromDocuments([], ECohereEmbeddingsModel())

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
  try {
    const load = await parser(filePath)

    const chunk = await doc_chuncker(load)

    if (!VDB) {
      VDB = await HNSWLib.fromDocuments(chunk, embeddings)
    } else {
      await VDB.addDocuments(chunk)
    }
    return VDB

    return VDB
  } catch (error) {
    console.error('Error storing file in VDB:', error)
    throw error
  }
}
