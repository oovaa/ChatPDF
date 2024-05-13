import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import detenv from "dotenv";
import { rl } from "../tools/io";
// @ts-ignore

// Access your API key as an environment variable (see "Set up your API key" above)
detenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function run() {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })


    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    })

    async function ask_respond() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit")
                rl.close()
            else {
                const result = await chat.sendMessage(msg)
                const respond = result.response
                // console.log("Respond object:", respond);
                const text = respond.text()
                console.log("AI: ", text);
                ask_respond()
            }
        })
    }
    ask_respond()
}

run()
