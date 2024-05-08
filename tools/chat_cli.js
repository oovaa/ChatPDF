import { createInterface } from 'readline';
import {  chainWithMessageHistory } from './chain.js';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Asks the user for input and handles the response.
 * @async
 * @function chat_loop
 * @returns {Promise<void>} A promise that resolves when the user exits the chat.
 */
async function chat_loop() {
  rl.question('You: ', async (msg) => {
    if (msg.toLocaleLowerCase() === 'exit') rl.close();
    else {
      const response = await chainWithMessageHistory.invoke(
        {
          input: msg
        },
        { configurable: { sessionId: 'unused' } }
      );
      console.log('\x1b[32m%s\x1b[0m', response.content); // Print response in green
      chat_loop();
    }
  });
}

chat_loop();

export { chat_loop, rl };
