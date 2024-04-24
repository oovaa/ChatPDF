import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { config } from 'dotenv';
import { ChatCohere, Cohere } from '@langchain/cohere';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

function Cgoogle(parms = {}) {
  return new ChatGoogleGenerativeAI(parms);
}
// const model = Cgoogle();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res.content);

function Ccohere(parms = {}) {
  return new ChatCohere(parms);
}
// const model = Ccohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res.content);

function Mcohere(param = {}) {
  return new Cohere(param);
}
// const model = Mcohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res);

function Mgoogle() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
}
// const model = Mcohere();
// let res = await model.invoke('can i use command R in langchain?');
// console.log(res);

export { Cgoogle, Ccohere, Mcohere, Mgoogle };

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