import { GoogleGenerativeAI } from "@google/generative-ai";
import detenv from "dotenv";

// Access your API key as an environment variable (see "Set up your API key" above)
detenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function run() {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = "text-embedding-001 which is free ?"

    const re = await model.generateContent(prompt)
    const ans = re.response;

    const text = ans.text();

    console.log(text);
}

run()
