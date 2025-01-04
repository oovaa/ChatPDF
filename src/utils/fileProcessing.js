import { TextLoader } from 'langchain/document_loaders/fs/text'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
import path from 'path'

export const parser = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  let loader = ''
  let docs = ''
  let allSlidesContent = ''

  switch (ext) {
    case '.pptx':
      try {
        loader = new PPTXLoader(filePath)
        docs = await loader.load()
        allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }

    case '.pdf':
      try {
        loader = new PDFLoader(filePath)
        docs = await loader.load()
        allSlidesContent = docs.map((doc) => doc.pageContent)
        
        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    case '.docx':
      try {
        loader = new DocxLoader(filePath)
        docs = await loader.load()
        allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    case '.txt':
      try {
        loader = new TextLoader(filePath)
        docs = await loader.load()
        allSlidesContent = docs.map((doc) => doc.pageContent)

        return docs
      } catch (err) {
        throw new Error(err.message)
      }
    default:
      throw new Error(`Unsupported file type: ${ext}`)
  }
}


