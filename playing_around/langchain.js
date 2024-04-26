import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { combine, retrevire } from './retriver';

const llm = Chat_google();

const tweet_template =
  'given a question generate a stand alone question: {question} standalone question:';

const ans_template = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the provided context.
   If you don't know the answer, say 'I'm sorry, I don't know the answer to that' and direct the question to email help@scrimba.com.
    Please avoid making up an answer. Always speak as if you were chatting with a friend.
    context: {context}
    question: {question}
    answer:
    `;

const tweet_prompt = PromptTemplate.fromTemplate(tweet_template);

const chain = tweet_prompt
  .pipe(llm)
  // @ts-ignore
  .pipe(new StringOutputParser())
  .pipe(retrevire)
  .pipe(combine);

const response = await chain.invoke({
  question: "I'm a complete beginner adn really nervous. Is scrimba for me?"
});

console.log(response);
