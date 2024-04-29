// get the path and validate it

import { existsSync } from 'fs';
import { extname } from 'path';
import { load_pdf, load_text } from '../tools/fileProcessing';
import { Hvectore } from '../tools/storage';
import { ECohereEmbeddings, Egoogleembedding } from '../models/Emodels';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { doc_chuncker } from '../tools/chuncker';

const file_path = process.argv[2];
const semilarity = process.argv[3];

if (!file_path || !existsSync(file_path)) {
  console.error(
    'Error: Please provide a valid file path as a command line argument.'
  );
  process.exit(1);
}

let doc;

const ext = extname(file_path);
// console.log(ext);

if (ext === '.txt') doc = await load_text(file_path);
else if (ext === '.pdf') doc = await load_pdf(file_path);

// console.log(doc);

const chunked = await doc_chuncker(doc);

const vecstore = await Hvectore(chunked, ECohereEmbeddings);

const retrevire = vecstore.asRetriever();

// console.log(retrevire);
// console.log(semilarity);

const sems = await retrevire.getRelevantDocuments(semilarity);

console.log(sems);
