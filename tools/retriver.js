import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels.js';

/**
 * Represents a vector store.
 * @type {}
 */
async function VectorStore () {
const VectorStore = await HNSWLib.load('./dbs/db', ECohereEmbeddings());
return VectorStore;
}

/**
 * The retriever object used for retrieving data from the VectorStore.
 * @type {any}
 */
async function retriever1 () {
const vstore = await VectorStore()
const retriever = await vstore.asRetriever();
return retriever
}

const retriever = await retriever1

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
