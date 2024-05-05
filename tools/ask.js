import { chainWithMessageHistory } from './chain.js';

/**
 * Asks a question and waits for a response.
 *
 * @param {string} msg - The question to ask.
 * @returns {Promise<any>} - A promise that resolves to the response or an error.
 */
async function ask(msg) {
  try {
    const response = await chainWithMessageHistory.invoke(
      {
        input: msg
      },
      { configurable: { sessionId: 'unused' } }
    );
    return response;
  } catch (error) {
    console.error('Error occurred while asking question:', error);
    throw error; // re-throw the error so it can be caught and handled by the calling code
  }
}

export { ask };
