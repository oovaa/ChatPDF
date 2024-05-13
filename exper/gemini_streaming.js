import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline"
import { rl } from "../tools/io";
// Access your API key as an environment variable (see "Set up your API key" above)
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


let isWaitingRespond = false

async function run() {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    })

    async function ask_respond() {
        if (!isWaitingRespond) {
            rl.question("You: ", async (msg) => {
                if (msg.toLocaleLowerCase() === "exit")
                    rl.close()

                else {
                    console.log("in the else");
                    isWaitingRespond = true
                    try {
                        const result = await chat.sendMessageStream(msg)
                        console.log("in the try");
                        let text = ""
                        console.log(result);
                        for await (const chunk of result.stream) {
                            console.log("in the for");

                            const chunk_text = chunk.text()
                            console.log("AI: ", chunk_text);
                            text += chunk_text
                        }
                        isWaitingRespond = false
                        ask_respond()
                    } catch (error) {
                        console.error("ERROR: ", error)
                        isWaitingRespond = false

                    }

                }
            })

        }
    }
    ask_respond()
}

run()
