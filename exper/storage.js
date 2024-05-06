import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { file_chuncker } from '../tools/chuncker';
import { Egoogleembedding } from '../models/Emodels';

// Create docs with a loader
const path = './exper/scrimba.txt';

const docs = await file_chuncker(path);

// Load the docs into the vector store
const vectorStore = await HNSWLib.fromDocuments(
  docs,
  Egoogleembedding({ model: 'embedding-001' })
);

console.log('vectorized');

console.log(vectorStore);

console.log('searching');
const re = await vectorStore.similaritySearch('CSS is greate', 4);

console.log(re);

// store in a db
// const directory = './dbs/Gembed';
// await vectorStore.save(directory);
