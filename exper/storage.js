import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { file_chuncker } from '../tools/chuncker';
import { Egoogleembedding } from '../models/Emodels';

// Create docs with a loader
const path = '/home/omar/Documents/learning/c handbook.pdf';

const docs = await file_chuncker(path);

// Load the docs into the vector store
const vectorStore = await HNSWLib.fromDocuments(
  docs,
  Egoogleembedding({ model: 'embedding-001' })
);

console.log('vectorized');

console.log(vectorStore);

console.log('searching');
const re = await vectorStore.similaritySearch('if statments', 4);

console.log(re);

// store in a db
const directory = './dbs/db';
await vectorStore.save(directory);

// the rule is working
