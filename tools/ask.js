import { CRchain } from '../tools/commandr.js';
import { formatConv } from './format.js';

const history = [];
/**
 * Asks a question and waits for a response.
 *
 * @param {string} msg - The question to ask.
 * @returns {Promise<string>} - A promise that resolves to the response or an error or a string with the llm response.
 */
async function ask(msg) {
  try {
    const response = await CRchain.invoke({
      question: msg,
      // @ts-ignore
      history: formatConv(history)
    });
    history.push(msg);
    history.push(response);
    return response;
  } catch (error) {
    console.error('Error occurred while asking question:', error);
    throw error; // re-throw the error so it can be caught and handled by the calling code
  }
}
export { ask };
