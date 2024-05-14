/**
 * Emodels.js
 *
 * This file contains functions that create instances of different embedding models.
 *
 * @module Emodels
 * @requires dotenv
 * @requires @langchain/google-genai
 * @requires @langchain/cohere
 * @requires @google/generative-ai
 */

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import { CohereEmbeddings } from '@langchain/cohere';

/**
 * Creates an instance of GoogleGenerativeAIEmbeddings.
 * @param {Object} params - Optional parameters for configuring the embeddings.
 * @returns {GoogleGenerativeAIEmbeddings} The instance of GoogleGenerativeAIEmbeddings.
 */
function Egoogleembedding(params = {}) {
  return new GoogleGenerativeAIEmbeddings(params);
}

/**
 * Embeds a query string using Google Generative AI Embeddings.
 * @param {string} str - The query string to embed.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of numbers representing the embedded query.
 */
async function Gembed_Query(str) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'embedding-001', // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: 'Document title'
  });
  return await embeddings.embedQuery(str);
}

/**
 * Creates an instance of CohereEmbeddings.
 * @returns {CohereEmbeddings} The instance of CohereEmbeddings.
 */
function ECohereEmbeddings() {
  return new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
    batchSize: 48 // Default value if omitted is 48. Max value is 96
  });
}

/**
 * Embeds a query string using Cohere embeddings.
 * @param {string} str - The query string to embed.
 * @returns {Promise<any>} A promise that resolves to the embedded query.
 */
async function Cembed_Query(str) {
  const embeddings = new CohereEmbeddings();
  return await embeddings.embedQuery(str);
}

// وَٱقۡصِدۡ فِی مَشۡیِكَ وَٱغۡضُضۡ مِن صَوۡتِكَۚ إِنَّ أَنكَرَ ٱلۡأَصۡوَ ٰ⁠تِ لَصَوۡتُ ٱلۡحَمِیرِ

export { Egoogleembedding, ECohereEmbeddings, Gembed_Query, Cembed_Query };
