import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels';
import { load_text } from '../tools/fileProcessing';
import { doc_chuncker } from '../tools/chuncker';
import { Hvectore, Mvectore, H_load_vectore } from '../tools/storage';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { pull } from 'langchain/hub';

let doc = await load_text('./playing_around/scrimba.txt');

// console.log(doc);

let chunked = await doc_chuncker(doc);

// console.log(chunked);

// const vectorStore = await Hvectore(chunked, ECohereEmbeddings);

const vectorStore = await H_load_vectore(
  './playing_around/db',
  ECohereEmbeddings
);

// console.log(vectorStore);
// vectorStore.save('./playing_around/db');

const retriever = vectorStore.asRetriever({ k: 6, searchType: 'similarity' });

const retrievedDocs = await retriever.invoke(
  'when are we going to learn javascript'
);

// console.log(retrievedDocs);

const llm = new ChatGoogleGenerativeAI({ model: 'gemini-pro' });

const prompt = await pull('rlm/rag-prompt');

// console.log(prompt);

const exampleMessages = await prompt.invoke({
  context: 'filler context',
  question: 'filler question'
});
exampleMessages;

// console.log(exampleMessages.messages[0].content);

