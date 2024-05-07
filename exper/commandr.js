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

const grammer_template = `gevien a sentence, fix any grammar problems in your sentense.
Question: {question}
Fixed question: 
`;

const grammer_prompt = PromptTemplate.fromTemplate(grammer_template);

const stand_alone_template = `if it is a question let's convert your question to a standalone question. 
Question: {question} 
Standalone question:`;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);

const answer_template = `provide an respose from the history if available, or generate a new respose be very friendly.
Question: {question}
History: {history}
respose:
`;
const answer_prompt = PromptTemplate.fromTemplate(answer_template);

// @ts-ignore
const grammer_chain = RunnableSequence.from([
  grammer_prompt,
  llm,
  new StringOutputParser()
  // (prevResult) => console.log(prevResult),
]);

// @ts-ignore
const stand_alone_chain = RunnableSequence.from([
  stand_alone_prompt,
  llm,
  new StringOutputParser()
]);

// @ts-ignore
const answer_chain = RunnableSequence.from([
  answer_prompt,
  llm,
  new StringOutputParser()
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
  { question: grammer_chain, original: new RunnablePassthrough() },
  {
    question: stand_alone_chain,
    history: ({ original }) => original.history
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
