import { PromptTemplate } from '@langchain/core/prompts';
import { Chat_google } from '../models/Cmodels';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ECohereEmbeddings } from '../models/Emodels';
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

const response = await chain.invoke({
  question:
    'what are the technical requirements for running Scrimba? I only have a very old lapty which is not that pwoerful'
});

console.log(response);
