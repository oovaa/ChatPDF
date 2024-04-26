import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels.js';

const VectorStore = await HNSWLib.load(
  './playing_around/db',
  ECohereEmbeddings()
);

const retrevire = VectorStore.asRetriever();

function combine(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

export { retrevire, combine };
