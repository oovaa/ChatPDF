import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { retrevire } from './retriver';

const llm = Chat_google();

const tweet_template =
  'given a question generate a stand alone question: {question} standalone question:';

const tweet_prompt = PromptTemplate.fromTemplate(tweet_template);

const chain = tweet_prompt
  .pipe(llm)
  // @ts-ignore
  .pipe(new StringOutputParser())
  .pipe(retrevire);

console.log(chain);

const response = await chain.invoke({
  question: "I'm a complete beginner adn really nervous. Is scrimba for me?"
});

console.log(response);
