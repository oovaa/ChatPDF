import { PromptTemplate } from '@langchain/core/prompts';
import { Cgoogle, Chat_google } from '../models/Cmodels';

const llm = Chat_google();

const tweet_template =
  'given a question generate a stand alone question: {question} standalone question:';

const tweet = PromptTemplate.fromTemplate(tweet_template);

const tweet_chain = tweet.pipe(llm);

const response = await tweet_chain.invoke({
  question:
    'If you were to think about European capitals, which city would come to mind when considering the country known for its Eiffel Tower and fine wine?'
});

console.log(response.content);
