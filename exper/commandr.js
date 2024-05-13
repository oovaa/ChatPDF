import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { createInterface } from 'readline';
import { formatConv } from '../tools/format.js';
import { CcommandRP } from '../models/Cmodels.js';
import { retriever, combine } from '../tools/retriver.js';
import { rl } from '../tools/io.js';

const EXIT_COMMAND = 'exit';
const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

const llm = CcommandRP;

const stand_alone_template = `
Given some conversation history (if any) and a question, convert the question to a standalone question. 

Conversation History: {history}
Original Question: {question}
Standalone Question: 
`;

const answer_template = `
You are ChatPDF, a supportive and enthusiastic bot. Your role is to answer questions using the context. If the answer is not in the context, find it in the conversation history when possible. If the answer isn't in the history, make up a sensible response. Always maintain a friendly tone.

Question: {question}
Context: {context}
Conversation History: {history}
Answer: 
`;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);
const answer_prompt = PromptTemplate.fromTemplate(answer_template);

// @ts-ignore
const stand_alone_chain = RunnableSequence.from([
  // (prevResult) => console.log(prevResult),

  stand_alone_prompt,
  llm,
  new StringOutputParser()
  // (prevResult) => console.log(prevResult),
]);

const retrieverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriever,
  combine
]);

// @ts-ignore
const answer_chain = RunnableSequence.from([
  answer_prompt,
  llm,
  new StringOutputParser()
  // (prevResult) => console.log(prevResult),
]);



// @ts-ignore
// const retriever_chain = RunnableSequence.from([
//   retriever,
//   llm,
//   new StringOutputParser()
// ]);

const CRchain = RunnableSequence.from([
  {
    question: (prevResult) => prevResult.question,
    history: (prevResult) => prevResult.history,
    standalone_question: stand_alone_chain
  },
  {
    question: (prevResult) => prevResult.question,
    context: retrieverChain,
    history: (prevResult) => prevResult.history
  },
  // (prevResult) => console.log(prevResult),
  answer_chain
]);

async function run() {
  const history = [];

  async function ask() {
    const question = await new Promise((resolve) =>
      rl.question('You: ', resolve)
    );
    if (question.toLocaleLowerCase() === EXIT_COMMAND) {
      rl.close();
    } else {
      const response = await CRchain.invoke({
        question: question,
        // @ts-ignore
        history: formatConv(history)
      });
      history.push(question);
      history.push(response);
      console.log(RESPONSE_COLOR, response);
      ask();
    }
  }

  ask();
}
// run();

export { CRchain };
