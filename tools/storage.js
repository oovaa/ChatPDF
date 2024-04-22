import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

async function Hvectore(doc, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.fromDocuments(doc, embedfunction());
  return vectorStore;
}

async function Mvectore(doc, embedfunction, param = {}) {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    doc,
    embedfunction()
  );
  return vectorStore;
}

async function H_load_vectore(path, embedfunction, param = {}) {
  const vectorStore = await HNSWLib.load(path, embedfunction());
  return vectorStore;
}

export { Hvectore, Mvectore, H_load_vectore };
