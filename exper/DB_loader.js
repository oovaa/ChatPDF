import { GoogleGenerativeAI } from '@google/generative-ai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels';

// Assuming the database is pre-loaded (or handle loading asynchronously)
const db = await HNSWLib.load('dbs/db', ECohereEmbeddings());

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// console.log(db); // Check if the database loaded successfully

const directory = 'dbs/db';

const loadedVectorStore = await HNSWLib.load(directory, ECohereEmbeddings());

const result = await loadedVectorStore.similaritySearch('Css is great', 4);
console.log(result);
