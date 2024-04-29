import { chain } from './chain.js';

/**
 * Asks a question and waits for a response.
 *
 * @param {string} msg - The question to ask.
 * @returns {Promise<any>} - A promise that resolves to the response.
 */
async function ask(msg) {
  const response = await chain.invoke({
    question: msg
  });
  return response;
}

export { ask };
