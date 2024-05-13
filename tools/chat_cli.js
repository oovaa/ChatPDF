import { createInterface } from 'readline';
import { CRchain } from '../tools/commandr.js';
import { formatConv } from './format.js';
import { rl } from './io.js';

const RESPONSE_COLOR = '\x1b[32m%s\x1b[0m'; // Green

async function run() {
  const history = [];

  async function ask() {
    rl.question('You: ', async (msg) => {
      if (msg.toLocaleLowerCase() === 'exit') rl.close();
      else {
        const response = await CRchain.invoke({
          question: msg,
          // @ts-ignore
          history: formatConv(history)
        });
        history.push(msg);
        history.push(response);
        console.log(RESPONSE_COLOR, response);
      }
    });
  }
  ask();
}

run();
