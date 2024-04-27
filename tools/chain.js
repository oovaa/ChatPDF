import {
  RunnableSequence,
  RunnablePassthrough
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { combine, retrevire } from './retriver.js';

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
const ans_template = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the provided context.
    If the answer isn't in context, please make up an answer that makes sense and mention that it's not from the context.
    Please avoid making up an answer. Always speak as if you were chatting with a friend.
    
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
    retrevire,
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

export { chain };
