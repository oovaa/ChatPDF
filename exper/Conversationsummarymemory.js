import { RunnableSequence, ModelRunnable } from 'langchain/runnables';
import { ConversationSummaryMemory } from 'langchain/memory';
import { PromptTemplate } from '@langchain/core/prompts';
import { CcommandRP } from '../models/Cmodels';

export const run = async () => {
  const memory = new ConversationSummaryMemory({
    memoryKey: 'chat_history',
    llm: CcommandRP()
  });
  const model = CcommandRP();
  const prompt = PromptTemplate.fromTemplate(
    `Current conversation: {chat_history}\nHuman: {input}\nAI:`
  );

  const modelRunnable = new ModelRunnable({ model, prompt });

  const sequence = new RunnableSequence({
    first: modelRunnable,
    last: modelRunnable
  });

  const inputs = ["Hi! I'm Jim.", "What's my name?"];
  for (let input of inputs) {
    const response = await sequence.invoke({ input });
    console.log({ response, memory: await memory.loadMemoryVariables({}) });
  }
};
run();
