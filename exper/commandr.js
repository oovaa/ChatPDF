import { ChatCohere } from '@langchain/cohere';
import { ChatPromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';

const prompt = ChatPromptTemplate.fromMessages([
  ['human', 'Tell me a short joke about {topic}']
]);
const model = new ChatCohere({ model: 'command-r-plus' });
const outputParser = new StringOutputParser();

// @ts-ignore
const chain = prompt.pipe(model).pipe(outputParser);

const res = await chain.invoke({
  topic: 'ice cream'
});

console.log(res);
