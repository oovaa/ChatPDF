import { GoogleGenerativeAI } from '@google/generative-ai';
import { file_chuncker } from '../tools/chuncker';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { createInterface } from 'readline';

const path = './exper/scrimba.txt';
const directory = 'exper/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const embed = new GoogleGenerativeAIEmbeddings();

const doc = await file_chuncker(path);

// console.log(doc);

// const vdb = await HNSWLib.fromDocuments(doc, embed) //not needed after we load from a db

// console.log(vdb);

// check the vdb

// const cvdb = await vdb.similaritySearch("Javascript", 3)
// console.log(cvdb); working

// await vdb.save(directory)

const loaded_vdb = await HNSWLib.load(directory, embed);

const re_vdb = loaded_vdb
  .asRetriever
  //  {} optinal config
  (); // what it dose? gets the all relevent chunks it is slow or not ?

// const cvdb = await loaded_vdb.similaritySearch("Javascript")
// // const cvdb = await re_vdb.getRelevantDocuments("Javascript")
// console.log(cvdb); // working

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function run() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500
    }
  });

  async function ask_respond() {
    rl.question('You: ', async (msg) => {
      if (msg.toLowerCase() === 'exit')
        // Fixed: Added parentheses after toLowerCase
        rl.close();
      else {
        // Use similaritySearch to find the most similar documents
        const retrievedDocs = await re_vdb.getRelevantDocuments(msg);

        const result = await chat.sendMessage(msg);
        const respond = result.response;
        // console.log("Respond object:", respond);
        const text = respond.text();
        console.log('AI: ', text);
        ask_respond();
      }
    });
  }
  ask_respond();
}

// run()
