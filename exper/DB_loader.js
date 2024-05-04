import { GoogleGenerativeAI } from "@google/generative-ai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embed = new GoogleGenerativeAIEmbeddings();

// Assuming the database is pre-loaded (or handle loading asynchronously)
const db = await HNSWLib.load("playing_around/db", embed);

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log(db); // Check if the database loaded successfully

const directory = "playing_around/db";

const loadedVectorStore = await HNSWLib.load(directory, new GoogleGenerativeAIEmbeddings());

const result = await loadedVectorStore.similaritySearch("hello world", 1);
console.log(result);
