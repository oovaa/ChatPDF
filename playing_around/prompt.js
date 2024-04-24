import { PromptTemplate } from '@langchain/core/prompts';
import { Cgoogle, Chat_google } from '../models/Cmodels';

const llm = Chat_google();

const tweet_template =
  'generate a promotinal tweet for a product, from this product discription: {productDesc}';

const tweet = PromptTemplate.fromTemplate(tweet_template);

const tweet_chain = tweet.pipe(llm);

const response = await tweet_chain.invoke({
  productDesc: 'dell laptop'
});

console.log(response.content);
