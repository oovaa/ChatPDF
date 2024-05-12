import { createInterface } from 'readline';
import { CRchain } from '../tools/commandr.js';
import { formatConv } from './format.js';

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
const history = [];
async function chat_loop() {
  rl.question('You: ', async (msg) => {
    if (msg.toLocaleLowerCase() === 'exit') rl.close();
    else {
      console.log(history);
      const response = await CRchain.invoke({
        question: msg,
        // @ts-ignore
        history: formatConv(history)
      });
      history.push(msg);
      history.push(response);
      console.log('\x1b[32m%s\x1b[0m', response); // Print response in green
      chat_loop();
    }
  });
}

chat_loop();

export { chat_loop, rl };
