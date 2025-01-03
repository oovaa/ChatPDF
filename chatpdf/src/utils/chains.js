import { PromptTemplate } from '@langchain/core/prompts'
import { CcommandRP } from '../models/Ccohere.js'
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { combine, retriever, Retriver } from '../db/retriver.js'

const llm = CcommandRP()

/**
 * Template for generating a stand-alone question.
 * @type {string}
 */
const stand_alone_template =
  'given a question generate a stand alone question: {question} standalone question:'

/**
 * Template for generating an answer based on the provided context and question.
 * @type {string}
 */

const ans_template = `Answer the user's questions based on the below context with details, please the answer makes sense. 
  If the context doesn't contain any relevant information to the question,use the conversation history don't make something up and just say "I don't know":
  
  Context: {context}
  History: {history}
  Question: {question}
  Answer:
  `

/**
 * Prompt template for generating a stand-alone question.
 * @type {PromptTemplate}
 */
const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template)

/**
 * Prompt template for generating an answer based on the provided context and question.
 * @type {PromptTemplate}
 */
const ans_prompt = PromptTemplate.fromTemplate(ans_template)

/**
 * Runnable sequence for generating a stand-alone question.
 * @type {RunnableSequence}
 */
export const stand_alone_chain = RunnableSequence.from([
  // @ts-ignore
  // (prevResult) => console.log(prevResult),
  stand_alone_prompt,
  llm,
  new StringOutputParser(),
])

/**
 * Runnable sequence for retrieving the context based on the stand-alone question.
 * @type {RunnableSequence}
 */
export const retrevire_chain = RunnableSequence.from([
  (prevResult) => prevResult.stand_alone,
   retriever,
  combine,
])

/**
 * Runnable sequence for generating an answer based on the provided context and question.
 * @type {RunnableSequence}
 */
export const answer_chain = RunnableSequence.from([
  // @ts-ignore
  ans_prompt,
  llm,
  new StringOutputParser(),
])

/**
 * Creates a runnable sequence chain with the following steps:
 * 1. A stand-alone chain with a passthrough origin.
 * 2. A context retrieval chain that extracts the question and history from the origin.
 * 3. An answer chain.
 *
 * @constant {RunnableSequence} chain - The runnable sequence chain.
 */
export const chain = RunnableSequence.from([
  {
    stand_alone: stand_alone_chain,
    origin: new RunnablePassthrough(),
  },
  {
    context: retrevire_chain,
    question: ({ origin }) => origin.question,
    history: ({ origin }) => origin.history,
  },
  // (prevResult) => console.log(prevResult),

  answer_chain,
])
