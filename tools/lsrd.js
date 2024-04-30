// Import necessary modules
import { existsSync, unlinkSync } from 'fs';
import { load_pdf, load_text } from './fileProcessing';
import { H_load_vectore, Hvectore } from './storage';
import { doc_chuncker } from './chuncker';
import { ECohereEmbeddings } from '../models/Emodels';

/**
 * Load a file based on its extension.
 * @param {string} path - The path to the file.
 * @return {Promise} - A promise that resolves with the loaded file.
 */
async function load(path) {
  if (path.slice(-3) === 'pdf') return await load_pdf(path);
  else if (path.slice(-3) === 'txt') return await load_text(path);
  console.log('loaded');
}

/**
 * Stores the document at the specified path in the database directory after processing it.
 * @param {string} path - The path of the document to be stored.
 * @param {string} db_dir - The directory where the document will be stored.
 * @param {Function} embfunc - The embedding function used for processing the document.
 * @returns {Promise<void>} - A promise that resolves when the document is successfully stored.
 */
async function store(path, db_dir, embfunc) {
  let doc = await load(path);
  let docs = await doc_chuncker(doc);
  const vecstore = await Hvectore(docs, embfunc);
  vecstore.save(db_dir);
  console.log('stored');
}

/**
 * Retrieve a vector space model from a database.
 * @param {string} db_dir - The directory of the database.
 * @param {Function} embfunc - The function to use for embedding.
 * @return {Promise} - A promise that resolves with the retriever.
 */
async function ret_reive(db_dir, embfunc) {
  const vecstore = await H_load_vectore(db_dir, embfunc);
  console.log('ret_reived');
  return vecstore.asRetriever();
}

/**
 * Delete a file if it exists.
 * @param {string} path - The path to the file.
 */
function delete_file(path) {
  if (existsSync(path)) {
    unlinkSync(path);
  } else {
    console.error('File does not exist.');
  }
  console.log('deleted');
}

/**
 * Load, store, retrieve, and delete a document.
 * @param {string} path - The path to the document.
 * @param {string} db_dir - The directory of the database.
 * @param {Function} embfunc - The function to use for embedding.
 * @return {Promise} - A promise that resolves with the retriever.
 */
async function lsrd(path, db_dir, embfunc) {
  store(path, db_dir, embfunc);
  const ret_riever = ret_reive(db_dir, embfunc);
  //   delete_file(path);
  return ret_riever;
}

const ret = await lsrd(
  './playing_around/story.txt',
  './dbs/db',
  ECohereEmbeddings
);

console.log(await ret.getRelevantDocuments('raining'));

export { load, store, ret_reive, delete_file };
