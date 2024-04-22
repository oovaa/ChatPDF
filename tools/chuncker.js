import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
TextLoader;

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

// uncomment to test

// const re = await file_chuncker("playing_around/scrimba.txt")

// console.log(re);
