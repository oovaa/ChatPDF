import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

/**
 * This function takes a document as input and splits it into chunks.
 * Each chunk is of size 700 characters and there is no overlap between chunks.
 * @param {Document[]} doc - The document to be chunked.
 * @returns {Promise<any[]>} - A promise that resolves to an array of chunks.
 */
export async function doc_chuncker(doc) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 0,
      chunkSize: 700,
    })
    const out = await splitter.splitDocuments(doc)
    return out
  } catch (error) {
    console.log('chuncker problem ', error)
    throw error
  }
}
