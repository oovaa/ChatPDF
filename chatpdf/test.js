import { Hvectore, StoreFileInVDB } from './src/db/hnsw'
import { getSemiliraties, Retriver } from './src/db/retriver.js'
import { ECohereEmbeddingsModel } from './src/embed/Ecohere'
import { doc_chuncker } from './src/utils/chunker.js'
import { parser } from './src/utils/fileProcessing'

// const path = './test.txt'
// const Embeddings = ECohereEmbeddingsModel()

// const load = await parser(path)
// // console.log(load)

// const chunk = await doc_chuncker(load)
// console.log(chunk)

// const vdb = await Hvectore(chunk, Embeddings)

// const similaritySearchResults = await vdb.similaritySearch('boy ', 2)

// const ret = vdb.asRetriever(2, (doc) => doc.metadata.source == './test.txt')
// const ret = Retriver(vdb) // k: 2 number of chunks

// const res1 = ret._getRelevantDocuments()
// const res2 = await ret.invoke('boy') // new way to retrive

// console.log(res2.map((x) => x.pageContent)[0])

// for (const doc of similaritySearchResults) {
//   console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`)
// }

//
// const vdb = await StoreFileInVDB(path)
// console.log(vdb)
// console.log(await getSemiliraties('Boy', vdb))
