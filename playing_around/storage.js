import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { file_juncker } from "../tools/juncker";


// Create docs with a loader
const loader = new TextLoader("./playing_around/scrimba.txt");
const file = await loader.load();

const docs = await file_juncker(file.toString())


// Load the docs into the vector store
const vectorStore = await HNSWLib.fromDocuments(docs, new GoogleGenerativeAIEmbeddings({
    model: "embedding-001"
}));

// Search for the most similar document
const result = await vectorStore.similaritySearch("omar", 1);
console.log(result);

const directory = "playing_around/db";
await vectorStore.save(directory);
