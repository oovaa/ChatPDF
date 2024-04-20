import { GoogleGenerativeAI } from "@google/generative-ai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { loadQAStuffChain, RetrievalQAChain } from "langchain/chains";

const embed = new GoogleGenerativeAIEmbeddings();

// Assuming the database is pre-loaded (or handle loading asynchronously)
const db = await HNSWLib.load("playing_around/db", embed);

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log(db); // Check if the database loaded successfully

// Assuming loadQAStuffChain doesn't require additional dependencies
const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(model),
    retriever: db.asRetriever(),
    returnSourceDocuments: true, // Adjust as needed
});

// Now you can use the `chain` object for your Q&A functionality
