import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { promises as fs } from 'fs';

/**
 * Loads a PDF document from the specified path.
 * @param {string} path - The path to the PDF file.
 * @returns {Promise<Object>} - A promise that resolves to the loaded PDF document.
 */
async function load_pdf(path) {
  const loader = new PDFLoader(path, {
    parsedItemSeparator: ''
  });
  const docs = await loader.load();
  
  return docs;
}

/**
 * Loads text from the specified path.
 * @param {string} path - The path to the file.
 * @returns {Promise<object>} - A promise that resolves to the loaded text.
 */
async function load_text(path) {
  const Tloader = new TextLoader(path);

  const Tdocs = await Tloader.load();

  return Tdocs;
}

async function deleteFile(filePath) {
  try {
      await fs.unlink(filePath);
  } catch (err) {
      console.error("Error deleting file:", err);
  }
}


export { load_pdf, load_text, deleteFile };
