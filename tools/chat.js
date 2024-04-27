import { createInterface } from 'readline';
import { chain } from './chain.js';

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Asks the user for input and handles the response.
 * @async
 * @function ask
 * @returns {Promise<void>} A promise that resolves when the user exits the chat.
 */
async function ask() {
  rl.question('You: ', async (msg) => {
    if (msg.toLocaleLowerCase() === 'exit') rl.close();
    else {
      const response = await chain.invoke({
        question: msg
      });
      console.log('\x1b[32m%s\x1b[0m', response); // Print response in green
      ask();
    }
  });
}

ask();

export { ask };
