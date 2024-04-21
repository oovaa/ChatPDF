import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

async function load_pdf(path) {
  const loader = new PDFLoader('./models/Python.pdf', {
    parsedItemSeparator: ''
  });

  const docs = await loader.load();
  return docs;
}

async function load_text(path) {
  const Tloader = new TextLoader('./playing_around/story.txt');

  const Tdocs = await Tloader.load();

  return Tdocs;
}
