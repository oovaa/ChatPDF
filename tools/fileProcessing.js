import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

async function load_pdf(path) {
  const loader = new PDFLoader(path , {
    parsedItemSeparator: ''
  });

  const docs = await loader.load();
  return docs;
}

async function load_text(path) {
  const Tloader = new TextLoader(path);

  const Tdocs = await Tloader.load();

  return Tdocs;
}

export { load_pdf, load_text };
