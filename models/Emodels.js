import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import { CohereEmbeddings } from '@langchain/cohere';

function Egoogleembedding(params = {}) {
  return new GoogleGenerativeAIEmbeddings(params);
}



async function Gembed_Query(str) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'embedding-001', // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: 'Document title'
  });
  return await embeddings.embedQuery(str);
}


function ECohereEmbeddings() {
  return new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
    batchSize: 48 // Default value if omitted is 48. Max value is 96
  });
}

async function Cembed_Query(str) {
  const embeddings = new CohereEmbeddings();
  return await embeddings.embedQuery(str);
}


// console.log((await Cembed_Query('omar')).length); // 1024
// console.log((await Gembed_Query('omar')).length); // 768

// وَٱقۡصِدۡ فِی مَشۡیِكَ وَٱغۡضُضۡ مِن صَوۡتِكَۚ إِنَّ أَنكَرَ ٱلۡأَصۡوَ ٰ⁠تِ لَصَوۡتُ ٱلۡحَمِیرِ

export { Egoogleembedding, ECohereEmbeddings, Gembed_Query, Cembed_Query };
