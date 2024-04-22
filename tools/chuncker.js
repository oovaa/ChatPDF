import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

/**
 * This function takes a file path as input, loads the file, and splits it into chunks.
 * Each chunk is of size 700 characters and there is no overlap between chunks.
 * @param {string} path - The path to the file to be chunked.
 * @returns {Promise<any[]>} - A promise that resolves to an array of chunks, where each chunk is an array of strings.
 */
async function file_chuncker(path) {
  try {
    const loader = new TextLoader(path);
    const file = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 0,
      chunkSize: 700
    });
    const out = await splitter.splitDocuments(file);
    return out;
  } catch (error) {
    console.log('chuncker problem ', error);
  }
}

/**
 * This function takes a document as input and splits it into chunks.
 * Each chunk is of size 700 characters and there is no overlap between chunks.
 * @param {Document[]} doc - The document to be chunked.
 * @returns {Promise<any[]>} - A promise that resolves to an array of chunks.
 */
async function doc_chuncker(doc) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 0,
      chunkSize: 700
    });
    const out = await splitter.splitDocuments(doc);
    return out;
  } catch (error) {
    console.log('chuncker problem ', error);
  }
}

export { file_chuncker, doc_chuncker };
