import { chain, chainWithMessageHistory } from './chain.js';

/**
 * Asks a question and waits for a response.
 *
 * @param {string} msg - The question to ask.
 * @returns {Promise<any>} - A promise that resolves to the response.
 */
async function ask(msg) {
  const response = await chainWithMessageHistory.invoke(
    {
      input:
        msg,
    },
    { configurable: { sessionId: "unused" } }
  );
  return response;
}

export { ask };