import { readFileSync } from "fs"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

try {

    const result = readFileSync("playing_around/scrimba.txt")
    const text = result.toString()

    const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 0,
        chunkSize: 700
    })
    const out = await splitter.createDocuments([text])
    console.log(out);

} catch (error) {
    console.log("chuncker problem ", error);
}