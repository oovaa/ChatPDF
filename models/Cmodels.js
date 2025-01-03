/**
 * Cmodels.js
 *
 * This file contains functions that create instances of different chat models.
 *
 * @module Cmodels
 * @requires dotenv
 * @requires @langchain/google-genai
 * @requires @langchain/cohere
 * @requires @google/generative-ai
 */
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { config } from 'dotenv'
import { ChatCohere, Cohere } from '@langchain/cohere'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
config()

/**
 * Creates a new instance of ChatGoogleGenerativeAI.
 *
 * @param {Object} [parms={}] - Parameters for the ChatGoogleGenerativeAI instance.
 * @returns {ChatGoogleGenerativeAI} - A new instance of ChatGoogleGenerativeAI.
 */
function Cgoogle(parms = {}) {
  return new ChatGoogleGenerativeAI(parms)
}
// const model = Cgoogle();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res.content);

/**
 * Creates a new instance of ChatCohere.
 *
 * @param {Object} [parms={}] - Parameters for the ChatCohere instance.
 * @returns {ChatCohere} - A new instance of ChatCohere.
 */

function Ccohere(parms = {}) {
  return new ChatCohere(parms)
}
// const model = Ccohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res.content);

/**
 * Creates a new instance of ChatCohere with the 'command-r-plus' model.
 *
 * @param {Object} [parms={}] - Parameters for the ChatCohere instance.
 * @returns {ChatCohere} - A new instance of ChatCohere.
 */
function CcommandRP(parms = {}) {
  const model = new ChatCohere({ model: 'command-r-plus' })
  return model
}

/**
 * Creates a new instance of Cohere.
 *
 * @param {Object} [param={}] - Parameters for the Cohere instance.
 * @returns {Cohere} - A new instance of Cohere.
 */
function Mcohere(param = {}) {
  return new Cohere(param)
}
// const model = Mcohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res);

/**
 * Creates a new instance of GoogleGenerativeAI's generative model.
 *
 * @returns {GoogleGenerativeAI} - A new instance of GoogleGenerativeAI's generative model.
 */
function Mgoogle() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  // @ts-ignore
  return genAI.getGenerativeModel({ model: 'gemini-pro' })
}

/**
 * Creates a new instance of ChatGoogleGenerativeAI with the 'gemini-pro' model.
 *
 * @returns {ChatGoogleGenerativeAI} - A new instance of ChatGoogleGenerativeAI.
 */
function Chat_google() {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-pro',
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
    apiKey: process.env.GEMINI_API_KEY,
  })
  return model
}
// const model = Mcohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res);

// Export the functions
export { Cgoogle, Ccohere, Mcohere, Mgoogle, Chat_google, CcommandRP }

// const model = new ChatCohere({
//     apiKey: process.env.COHERE_API_KEY, // Default
//     model: "command", // Default
// });
// const prompt = ChatPromptTemplate.fromMessages([
//     ["ai", "You are a helpful assistant"],
//     ["human", "{input}"],
// ]);
// const chain = prompt.pipe(model);
// const response = await chain.invoke({
//     input: "Hello there friend!",
// });
// console.log("response", response);
/**
response AIMessage {
  lc_serializable: true,
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: "Hi there! I'm not your friend, but I'm happy to help you in whatever way I can today. How are you doing? Is there anything I can assist you with? I am an AI chatbot capable of generating thorough responses, and I'm designed to have helpful, inclusive conversations with users. \n" +
    '\n' +
    "If you have any questions, feel free to ask away, and I'll do my best to provide you with helpful responses. \n" +
    '\n' +
    'Would you like me to help you with anything in particular right now?',
  additional_kwargs: {
    response_id: 'c6baa057-ef94-4bb0-9c25-3a424963a074',
    generationId: 'd824fcdc-b922-4ae6-8d45-7b65a21cdd6a',
    token_count: {
      prompt_tokens: 66,
      response_tokens: 104,
      total_tokens: 170,
      billed_tokens: 159
    },
    meta: { api_version: [Object], billed_units: [Object] },
    tool_inputs: null
  }
}
 */

// Text
// const model = new ChatGoogleGenerativeAI();

// const res = await model.invoke([
//     [
//         "human",
//         "What would be a good company name for a company that makes colorful socks?",
//     ],
// ]);

// console.log(res.content);
