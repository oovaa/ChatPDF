import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels.js';

/**
 * Represents a vector store.
 * @type {HNSWLib}
 */
const VectorStore = await HNSWLib.load('./dbs/db', ECohereEmbeddings());

/**
 * The retriever object used for retrieving data from the VectorStore.
 * @type {any}
 */
const retriever = VectorStore.asRetriever(4);

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
