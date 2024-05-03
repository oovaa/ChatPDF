import {
  RunnableSequence,
  RunnablePassthrough
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { combine, retrevire } from './retriver.js';
import { createInterface } from 'readline';
import { formatConv } from './conv_history.js';

const EXIT_COMMAND = 'exit';
const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

const llm = Chat_google();

const stand_alone_template = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;

const ans_template = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the provided context and the conversation history.
 try to find the answer in the conversation history. If it's not available, please make up an answer that makes sense and mention that it's not from the context.
  Always speak as if you were chatting with a friend.

  context: {context}
  conversation history: {conv_history}
  question: {question}
  answer: `;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);
const ans_prompt = PromptTemplate.fromTemplate(ans_template);

class ConversationHistory {
  constructor() {
    this.history = [];
  }

  add(message) {
    this.history.push(message);
  }

  format() {
    return formatConv(this.history);
  }
}

const conv_history = new ConversationHistory();

const stand_alone_chain = RunnableSequence.from([
  stand_alone_prompt,
  llm,
  new StringOutputParser()
]);

const retrevire_chain = RunnableSequence.from([
  (prevResult) => prevResult.stand_alone,
  retrevire,
  // (prevResult) => console.log(prevResult),
  combine
]);

const answer_chain = RunnableSequence.from([
  ans_prompt,
  llm,
  new StringOutputParser()
]);

const chain = RunnableSequence.from([
  {
    stand_alone: stand_alone_chain,
    original_input: new RunnablePassthrough(),
    conv_history: new RunnablePassthrough()
  },
  {
    context: retrevire_chain,
    question: ({ original_input }) => original_input.question,
    conv_history: ({ original_input }) => original_input.conv_history
  },
  answer_chain
]);

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function ask() {
  const question = await new Promise((resolve) =>
    rl.question('You: ', resolve)
  );
  if (question.toLocaleLowerCase() === EXIT_COMMAND) {
    rl.close();
  } else {
    const response = await chain.invoke({
      question,
      conv_history: conv_history.format()
    });
    console.log(RESPONSE_COLOR, response);
    conv_history.add(question);
    conv_history.add(response);
    ask();
  }
}

ask();
