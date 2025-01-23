/**
 * Hashes a string using Bun's built-in password hashing utility.
 * This function is asynchronous and uses the default hashing algorithm provided by Bun.
 *
 * @param {string} str - The string to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed string.
 * @example
 * const hashedPassword = await hashStr("myPassword123");
 * console.log(hashedPassword); // Outputs the hashed string
 */
const hashStr = async (str) => {
  return await Bun.password.hash(str)
}

/**
 * Verifies if a plaintext string matches a previously hashed string.
 * This function is asynchronous and uses Bun's built-in password verification utility.
 *
 * @param {string} str - The plaintext string to verify.
 * @param {string} hash - The hashed string to compare against.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the strings match, otherwise `false`.
 * @example
 * const isValid = await verifyHash("myPassword123", hashedPassword);
 * console.log(isValid); // Outputs `true` if the password matches the hash
 */
const verifyHash = async (str, hash) => {
  return await Bun.password.verify(str, hash)
}

// usage
// ;(async () => {
//   // Hash a password
//   const password = 'myPassword123'
//   const hashedPassword = await hashStr(password)
//   console.log('Hashed Password:', hashedPassword)

//   // Verify the password
//   const isValid = await verifyHash(password, hashedPassword)
//   console.log('Password Verification:', isValid) // Should output `true`
// })()

export { hashStr, verifyHash }
