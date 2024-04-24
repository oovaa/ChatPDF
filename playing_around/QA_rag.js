import { createInterface } from 'readline';
import { Chat_google } from '../models/Cmodels';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const chatHistory = []; // Array to store chat history

async function run() {
  const llm = Chat_google();

  function ask() {
    rl.question('You: ', async (msg) => {
      if (msg.toLocaleLowerCase() === 'exit') {
        rl.close();
      } else {
        const result = await llm.invoke([['human', msg]]);
        const aiResponse = result.content;

        console.log('AI:', aiResponse);

        chatHistory.push({ user: msg, ai: aiResponse }); // Store user and AI responses in chat history

        ask(); // Ask the next question
      }
    });
  }

  ask();
}

run();
