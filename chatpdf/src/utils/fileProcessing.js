import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
import path from 'path'

export const parser = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  let loader = ''
  let docs = ''
  // let allSlidesContent = ''

  switch (ext) {
    case '.pptx':
      try {
        loader = new PPTXLoader(filePath)
        docs = await loader.load()
        // allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }

    case '.pdf':
      try {
        loader = new PDFLoader(filePath)
        docs = await loader.load()
        // allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    case '.docx':
      try {
        loader = new DocxLoader(filePath)
        docs = await loader.load()
        // allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    case '.txt':
      try {
        loader = new TextLoader(filePath)
        docs = await loader.load()
        // allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    default:
      throw new Error(`Unsupported file type: ${ext}`)
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
      chunkSize: 700,
    })
    const out = await splitter.splitDocuments(doc)
    return out
  } catch (error) {
    console.log('chuncker problem ', error)
  }
}

const re = await parser('./chatpdf/test.txt')

console.log(re)

const ch = await doc_chuncker(re)

console.log(ch)
