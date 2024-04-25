import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels';

const VectorStore = await HNSWLib.load(
  './playing_around/db',
  ECohereEmbeddings()
);

const retrevire = VectorStore.asRetriever();

export { retrevire };
