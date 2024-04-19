import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";


async function run() {
    const vectorStore = await HNSWLib.fromTexts(
        ["Hello world", "Bye bye", "hello nice world"],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001"
        })
    );

    const resultOne = await vectorStore.similaritySearch("hello world", 1);
    console.log(resultOne);
}

run();