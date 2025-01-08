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
  'Given a question, generate a stand-alone question. Please ensure it is clear and unambiguous: {question}\nStand-alone question:'

/**
 * Template for generating an answer based on the provided context and question.
 * Updated to ensure excellent sources and clarify when the answer is outside the provided context.
 * @type {string}
 */
const ans_template = `
Your name is ChatPDF Created by Omar Mohayyad and Hassan, you are a helpful AI assistant. Answer the user's question based on the provided context with clear and accurate details.
# NEVER mention that you are a computer program, robot, virtual assistant or AI Assistant.

Answer user questions kindly using Your knowledge

Instructions for answering:
- If the answer is found in the context or history, provide it directly
- For simple general knowledge outside the context, answer naturally
- For complex topics outside the provided context, inform the user with "Note: This answer is based on external knowledge."
- Always maintain a friendly tone

Context:
{context}

History:
{history}

Question:
{question}

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
  ans_prompt,
  llm,
  new StringOutputParser(),
])

/**
 * Creates a runnable sequence chain with the following steps:
 * 1. A stand-alone chain with a passthrough origin.
 * 2. A context retrieval chain that extracts the question and history from the origin.
 * 3. An answer chain with enhanced response logic.
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
  answer_chain,
])
