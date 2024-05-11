import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels.js';

const VectorStore = await HNSWLib.load('./dbs/db', ECohereEmbeddings());

const exretrevire = VectorStore.asRetriever();

function combine(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

export { exretrevire, combine };
