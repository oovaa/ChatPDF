import { StringOutputParser } from 'langchain/schema/output_parser';
import { Chat_google } from '../models/Cmodels';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';
const llm = Chat_google();

const punctuation_template = `Given a sentence, add punctuation where needed.
Sentence: {sentence}
Sentence with punctuation:
`;

const punctuation_prompt = PromptTemplate.fromTemplate(punctuation_template);

const grammar_template = `Given a sentence, fix the grammar where needed.
Sentence: {sentence}
Sentence with corrected grammar:
`;

const grammar_prompt = PromptTemplate.fromTemplate(grammar_template);

const translation_template = `Translate the sentence to {language}.
Sentence: {sentence}
Translated sentence:
`;
const translation_prompt = PromptTemplate.fromTemplate(translation_template);

const translation_chain = RunnableSequence.from([
  // @ts-ignore
  translation_prompt,
  //   (prevResult) => console.log(prevResult),
  llm,
  new StringOutputParser()
]);

const punctuation_chain = RunnableSequence.from([
  // @ts-ignore
  punctuation_prompt,
  //   (prevResult) => console.log(prevResult),
  llm,
  new StringOutputParser()
]);

const grammer_chain = RunnableSequence.from([
  // @ts-ignore
  grammar_prompt,
  //   (prevResult) => console.log(prevResult),
  llm,
  new StringOutputParser()
]);
// @ts-ignore
const chain = RunnableSequence.from([
  { sentence: punctuation_chain },
  grammer_chain,
  translation_chain
]);

const response = await chain.invoke({
  sentence: 'i dont liked mondays',
  language: 'arabic'
});

console.log(response);
