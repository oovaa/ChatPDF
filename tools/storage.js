import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';



/**
 * Creates a vector store from the given documents using the specified embedding function.
 * @param {Array} doc - The documents to create the vector store from.
 * @param {Function} embedfunction - The embedding function to use for creating the vectors.
 * @param {Object} [param={}] - Additional parameters for the vector store creation.
 * @returns {Promise} A promise that resolves to the created vector store.
 */
async function Hvectore(doc, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.fromDocuments(doc, embedfunction());
  return vectorStore;
}

/**
 * Creates a MemoryVectorStore from the given document using the provided embed function.
 * @param {Array} docs - The document to create the MemoryVectorStore from.
 * @param {Function} embedfunction - The embed function to use for creating the MemoryVectorStore.
 * @param {Object} [param={}] - Additional parameters for the MemoryVectorStore.
 * @returns {Promise<MemoryVectorStore>} The created MemoryVectorStore.
 */
async function Mvectore(docs, embedfunction, param = {}) {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    embedfunction()
  );
  return vectorStore;
}

/**
 * Loads a vector store from the specified path using the provided embed function.
 * @param {string} path - The path to the vector store.
 * @param {Function} embedfunction - The embed function used to load the vector store.
 * @param {Object} [param={}] - Additional parameters for the embed function.
 * @returns {Promise} - A promise that resolves to the loaded vector store.
 */
async function H_load_vectore(path, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.load(path, embedfunction());
  return vectorStore;
}

export { Hvectore, Mvectore, H_load_vectore };
