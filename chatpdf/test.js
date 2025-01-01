import { Hvectore } from './src/db/hnsw'
import { ECohereEmbeddingsModel } from './src/embed/Ecohere'
import { doc_chuncker } from './src/utils/chunker.js'
import { parser } from './src/utils/fileProcessing'

const path = './test.txt'
const Embeddings = ECohereEmbeddingsModel()

const load = await parser(path)
// console.log(load)

const chunk = await doc_chuncker(load)
// console.log(chunk)

const vdb = await Hvectore(chunk, Embeddings)

const similaritySearchResults = await vdb.similaritySearch('boy ', 2)

console.log(similaritySearchResults)

// for (const doc of similaritySearchResults) {
//   console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`)
// }
