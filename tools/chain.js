import {
  RunnableSequence,
  RunnablePassthrough
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { combine, retriever } from './retriver.js';
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

const llm = Chat_google();

/**
 * Template for generating a stand-alone question.
 * @type {string}
 */
const stand_alone_template =
  'given a question generate a stand alone question: {question} standalone question:';

/**
 * Template for generating an answer based on the provided context and question.
 * @type {string}
 */

const ans_template = `Answer the user's questions based on the below context with details. 
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

Context: {context}
Question: {question}
Answer:
`;

/**
 * Prompt template for generating a stand-alone question.
 * @type {PromptTemplate}
 */
const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);

/**
 * Prompt template for generating an answer based on the provided context and question.
 * @type {PromptTemplate}
 */
const ans_prompt = PromptTemplate.fromTemplate(ans_template);

/**
 * Runnable sequence for generating a stand-alone question.
 * @type {RunnableSequence}
 */
const stand_alone_chain = RunnableSequence.from([
  // @ts-ignore
  stand_alone_prompt,
  llm,
  new StringOutputParser()
]);

/**
 * Runnable sequence for retrieving the context based on the stand-alone question.
 * @type {RunnableSequence}
 */
const retrevire_chain = RunnableSequence.from([
  (prevResult) => prevResult.stand_alone,
  retriever,
  combine
]);

/**
 * Runnable sequence for generating an answer based on the provided context and question.
 * @type {RunnableSequence}
 */
const answer_chain = RunnableSequence.from([
  // @ts-ignore
  ans_prompt,
  llm,
  new StringOutputParser()
]);

/**
 * Main runnable sequence that combines the stand-alone question, context retrieval, and answer generation.
 * @type {RunnableSequence}
 */
const chain = RunnableSequence.from([
  { stand_alone: stand_alone_chain, original_input: new RunnablePassthrough() },
  {
    context: retrevire_chain,
    question: ({ original_input }) => original_input.question
  },
  answer_chain
]);

/* chat history */

/**
 * Runnable with message history prompt for generating prompts based on previous chat messages.
 * This prompt includes a system message introducing the chatbot's purpose and instructions for interaction,
 * a placeholder for historical chat messages, and a placeholder for user input.
 */

const runnableWithMessageHistoryPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are ChatPdf,deisgned by Hassan, Omar and Esraa, a helpful and enthusiastic support bot who can answer questions about documents based on the provided context.
    If the answer isn't in the context, please make up an answer that makes sense and mention that its not from the context.
     Always speak as if you were chatting with a friend. Feel free to engage in friendly conversation.`
  ],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}']
]);

// Creating a new chain by piping a runnable with message history prompt into a language model runnable.
const chain2 = runnableWithMessageHistoryPrompt.pipe(llm);

// Instantiating a new chat message history object for the chain.
const demoEphemeralChatMessageHistoryForChain = new ChatMessageHistory();

// Creating a new runnable with message history, incorporating the chain with message history prompt and chat message history.
const chainWithMessageHistory = new RunnableWithMessageHistory({
  runnable: chain2,
  getMessageHistory: (_sessionId) => demoEphemeralChatMessageHistoryForChain,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history'
});
export { chain, chainWithMessageHistory };