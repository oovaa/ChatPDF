import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { file_chuncker } from "../tools/chuncker";


// Create docs with a loader
const path = "./playing_around/scrimba.txt";

const docs = await file_chuncker(path)


// Load the docs into the vector store
const vectorStore = await HNSWLib.fromDocuments(docs, new GoogleGenerativeAIEmbeddings({
    model: "embedding-001"
}));


const directory = "playing_around/db";
await vectorStore.save(directory);
