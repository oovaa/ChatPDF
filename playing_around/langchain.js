import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { promises as fs } from 'fs';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { CohereEmbeddings } from '@langchain/cohere';

try {
  const data = await fs.readFile('./playing_around/scrimba.txt', 'utf8');
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 700
  });
  const out = await splitter.createDocuments([data]);

  const vectorstore = await HNSWLib.fromDocuments(out, new CohereEmbeddings());
  // vectorstore.docstore._docs.forEach((x) => console.log(x.pageContent)); print docs

} catch (err) {
  console.error(err);
}
