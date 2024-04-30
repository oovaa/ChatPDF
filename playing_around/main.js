// get the path and validate it

import { existsSync } from 'fs';
import { extname } from 'path';
import { load_pdf, load_text } from '../tools/fileProcessing';
import { Hvectore } from '../tools/storage';
import { ECohereEmbeddings, Egoogleembedding } from '../models/Emodels';
import { doc_chuncker } from '../tools/chuncker';
import { ask } from '../tools/ask';

const file_path = process.argv[2];
const question = process.argv[3];

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
// console.log(question);

const sems = await retrevire.getRelevantDocuments(question);

// console.log(sems);

const ans = await ask(question);

console.log(ans);
