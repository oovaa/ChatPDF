import { PromptTemplate } from '@langchain/core/prompts';
import { Cgoogle } from '../models/Cmodels';

const model = Cgoogle({});
const promptTemplate = PromptTemplate.fromTemplate(
  'Tell me a fact about {topic}'
);

const chain = promptTemplate.pipe(model);

const result = await chain.invoke({ topic: 'palestine' });

console.log(result.content);
