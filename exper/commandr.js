import { ChatCohere } from '@langchain/cohere';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { createInterface } from 'readline';
import { formatConv } from './conv_history';

const EXIT_COMMAND = 'exit';
const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

const llm = new ChatCohere({ model: 'command-r-plus' });

const grammer_template = `Given a question, fix the grammar problems if any.
question: {question}
fixed question: 
`;

const grammer_prompt = PromptTemplate.fromTemplate(grammer_template);

const stand_alone_template = `Given a question, convert the question to a standalone question. 
question: {question} 
standalone question:`;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);

const answer_template = `Given a question, provide an answer from the history if available, or generate a new answer.
Question: {question}
History: {history}
Answer:
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
  { question: grammer_chain },
  stand_alone_chain
  // (prevResult) => console.log(prevResult),
]);
const history = [];

async function ask() {
  const question = await new Promise((resolve) =>
    rl.question('You: ', resolve)
  );
  if (question.toLocaleLowerCase() === EXIT_COMMAND) {
    rl.close();
  } else {
    const response = await answer_chain.invoke({
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
