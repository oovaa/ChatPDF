import { readFileSync } from "fs"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"




/**
 * @param {String} path
 */
async function file_juncker(path) {
    try {

        const result = readFileSync(path)
        const text = result.toString()

        const splitter = new RecursiveCharacterTextSplitter({
            chunkOverlap: 0,
            chunkSize: 700
        })
        const out = await splitter.createDocuments([text])
        return out

    } catch (error) {
        console.log("juncker problem ", error);
    }
}

export { file_juncker };

// uncomment to test

// const re = await file_juncker("playing_around/scrimba.txt")

// console.log(re);

