import {
  RunnableSequence,
  RunnablePassthrough
} from 'langchain/schema/runnable';
import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { combine, retrevire } from './retriver';

const llm = Chat_google();

const stand_alone_template =
  'given a question generate a stand alone question: {question} standalone question:';

const ans_template = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the provided context.
   If you don't know the answer, say 'I'm sorry, I don't know the answer to that' and direct the question to email help@scrimba.com.
    Please avoid making up an answer. Always speak as if you were chatting with a friend.
    context: {context}
    question: {question}
    answer:
    `;

const stand_alone_prompt = PromptTemplate.fromTemplate(stand_alone_template);

const ans_prompt = PromptTemplate.fromTemplate(ans_template);

const stand_alone_chain = RunnableSequence.from([
  // @ts-ignore
  stand_alone_prompt,
  llm,
  new StringOutputParser()
]);

// @ts-ignore
const retrevire_chain = RunnableSequence.from([
  (prevResult) => prevResult.stand_alone,
  retrevire,
  // (prevResult) => console.log(prevResult),
  combine
]);

const answer_chain = RunnableSequence.from([
  // @ts-ignore
  ans_prompt,
  llm,
  new StringOutputParser()
]);

// @ts-ignore
const chain = RunnableSequence.from([
  { stand_alone: stand_alone_chain, original_input: new RunnablePassthrough() },
  {
    context: retrevire_chain,
    question: ({ original_input }) => original_input.question
  },
  answer_chain
]);

// .pipe(llm)
// // @ts-ignore
// .pipe(new StringOutputParser())
// .pipe(retrevire)
// .pipe(combine);

const response = await chain.invoke({
  question: 'i have a very old laptop will scrimba work for me?'
});

console.log(response);
