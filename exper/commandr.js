import { ChatCohere } from '@langchain/cohere';
import { ChatPromptTemplate, isLLM, PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { createInterface } from 'readline';
import { retriever } from '../tools/retriver';

const EXIT_COMMAND = 'exit';
const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

const prompt = ChatPromptTemplate.fromMessages([
  ['human', 'Tell me a short joke about {topic}']
]);
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

async function ask() {
  const question = await new Promise((resolve) =>
    rl.question('You: ', resolve)
  );
  if (question.toLocaleLowerCase() === EXIT_COMMAND) {
    rl.close();
  } else {
    const response = await chain.invoke({
      question: question
    });
    console.log(RESPONSE_COLOR, response);

    ask();
  }
}

ask();
