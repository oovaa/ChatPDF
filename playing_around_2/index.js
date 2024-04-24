import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/**
 * Retrieves an instance of the PDFLoader.
 * @returns {PDFLoader} An instance of the PDFLoader initialized with the specified PDF file path.
 */
function getPdfLoader() {
    /* get the PDFLoader instance */
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const pdfFilePath = join(__dirname, 'exFile.pdf');
    return new PDFLoader(pdfFilePath);
}

const docSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Prompts using the Gemini API can exceed max 20MB in size. 
    chunkOverlap: 20, 
    separators: ["/n/n","."] 
});


/**
 * Embeds the content of the provided documents using Google Generative AI Embeddings.
 * @param {Array<Object>} docs - An array of documents with pageContent property.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of embedded documents.
 */
async function embedDocuments(docs) {

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: 'embedding-001',
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: 'Document title',
        apiKey: process.env.GEMINI_API_KEY
    });

    const embeddedDocs = [];
    for (const doc of docs) {
        const embeddedDoc = await embeddings.embedQuery(doc.pageContent);
        embeddedDocs.push(embeddedDoc);
    }
    return embeddedDocs;
}


/*load + split PDF*/
const loadedDoc = await getPdfLoader().load();
const docs = await docSplitter.splitDocuments(loadedDoc);

/*embedding*/
const embeddedDocs = await embedDocuments(docs);
console.log(embeddedDocs)
