import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels.js';

/**
 * Represents a vector store.
 * @returns {Promise<HNSWLib>} - The vector store.
 */
async function VectorStore() {
  const VectorStore = await HNSWLib.load('./dbs/db', ECohereEmbeddings());
  return VectorStore;
}

/**
 * The retriever object used for retrieving data from the VectorStore.
 * @returns {Promise<any>} - The retriever object.
 */
async function retriever() {
  const vstore = await VectorStore();
  const retriever = await vstore.asRetriever();
  return retriever;
}

/**
 * Combines the page content of multiple documents into a single string.
 *
 * @param {Array} docs - An array of documents.
 * @returns {string} - The combined page content as a string.
 */
function combine(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

export { retriever, combine };
