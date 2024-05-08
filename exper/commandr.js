import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import {
  RunnablePassthrough,
  RunnableSequence
} from 'langchain/schema/runnable';
import { createInterface } from 'readline';
import { formatConv } from './conv_history';
import { CcommandRP } from '../models/Cmodels';

const EXIT_COMMAND = 'exit';
const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

const llm = CcommandRP;

const grammer_template = `Given a sentence, correct any grammar issues present. If the sentence is already correct, simply pass it as is.
Original Sentence: {question}
Corrected Sentence: 
`;

const stand_alone_template = `Given a sentence, if it is a question, it will be transformed into a standalone question. If not, it will be passed as is.
Original Sentence: {question}
Standalone Question: 
`;

const answer_template = `You are a helpful and enthusiastic support bot who can answer a given question based on the conversation history. Try to find the answer in the history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Always speak as if you were chatting to a friend.
Conversation History: {history}
Question: {question}
Answer: 
`;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);
const grammer_prompt = PromptTemplate.fromTemplate(grammer_template);
const answer_prompt = PromptTemplate.fromTemplate(answer_template);

// @ts-ignore
const grammer_chain = RunnableSequence.from([
  grammer_prompt,
  llm,
  new StringOutputParser()
]);

// @ts-ignore
const stand_alone_chain = RunnableSequence.from([
  // (prevResult) => console.log(prevResult),

  stand_alone_prompt,
  llm,
  new StringOutputParser()
  // (prevResult) => console.log(prevResult),
]);

// @ts-ignore
const answer_chain = RunnableSequence.from([
  answer_prompt,
  llm,
  new StringOutputParser()
  // (prevResult) => console.log(prevResult),
]);

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// @ts-ignore
// const retriever_chain = RunnableSequence.from([
//   retriever,
//   llm,
//   new StringOutputParser()
// ]);

const chain = RunnableSequence.from([
  // { question: grammer_chain, original: new RunnablePassthrough() },
  {
    question: (prevResult) => prevResult.question,
    original_input: new RunnablePassthrough()
  },
  {
    question: stand_alone_chain,
    history: ({ original_input }) => original_input.history
  },
  // (prevResult) => console.log(prevResult),

  answer_chain
]);
const history = [];

async function ask() {
  const question = await new Promise((resolve) =>
    rl.question('You: ', resolve)
  );
  if (question.toLocaleLowerCase() === EXIT_COMMAND) {
    rl.close();
  } else {
    const response = await chain.invoke({
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
