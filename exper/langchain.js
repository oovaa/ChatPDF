import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { file_chuncker } from '../tools/chuncker';
import { ECohereEmbeddings } from '../models/Emodels';
import { Cgoogle } from '../models/Cmodels';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';

const filepath = 'exper/scrimba.txt';

const llm = Cgoogle();

const chunked = await file_chuncker(filepath);

const vecs = await HNSWLib.fromDocuments(chunked, ECohereEmbeddings());

const ret = vecs.asRetriever();

const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `;
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const res = await standaloneQuestionChain.invoke({
  question: 'hi i have a very old laptop will linux work on it?',
  conv_history: 'my name is omar'
});

console.log(res);
