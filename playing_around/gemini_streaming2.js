import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    while (true) {
        const msg = await getUserInput(); // Replace this with your user input method

        if (msg === "exit" || msg === "quit") {
            break; // Exit on exit command
        }

        // Send message and get response for each turn
        const result = await model.startChat({
            input: { text: msg },
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const response = await result.response;
        const text = response.text();
        console.log("You:", msg);
        console.log("Gemini:", text);
    }
}

// Replace this with your actual method to get user input (e.g., read from console)
function getUserInput() {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question("You: ", (input) => {
            readline.close();
            resolve(input);
        });
    });
}

run();
