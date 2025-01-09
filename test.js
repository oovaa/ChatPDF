// import {
//   RunnablePassthrough,
//   RunnableSequence,
// } from '@langchain/core/runnables'
// import { Hvectore, StoreFileInVDB } from './src/db/hnsw'
// import { combine, retriever, Retriver } from './src/db/retriver.js'
// import { ECohereEmbeddingsModel } from './src/models/Ecohere'
// import {
//   answer_chain,
//   chain,
//   retrevire_chain,
//   stand_alone_chain,
// } from './src/utils/chains.js'
// import { doc_chuncker } from './src/utils/chunker.js'
// import { parser } from './src/utils/fileProcessing'

import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import {  StoreFileInVDB } from './src/db/hnsw'
import { setVDB, VDB } from './src/db/retriver'
import { ECohereEmbeddingsModel } from './src/models/Ecohere'
import { chain } from './src/utils/chains'
import { doc_chuncker } from './src/utils/chunker'
import { parser } from './src/utils/fileProcessing'

// const db = await StoreFileInVDB('./test.txt')

// // console.log(db)

// setVDB(db)

// const ans = await chain.invoke({
//   question: 'what is tne boys age and name',
//   history: 'the boy is 19 y/o',
// })

// console.log(ans)

// const chain = RunnableSequence.from([
//   { stand_alone: stand_alone_chain, original_input: new RunnablePassthrough() },
//   {
//     context: retrevire_chain,
//     question: ({ original_input }) => original_input.question,
//   },
//   answer_chain,
// ])

const path = './test.txt'
const Embeddings = ECohereEmbeddingsModel()

const load = await parser(path)
// console.log(load)

const chunk = await doc_chuncker(load)
// console.log(chunk)

const vdb = await HNSWLib.fromDocuments([], Embeddings)
console.log(vdb)

await vdb.addDocuments(chunk)

const similaritySearchResults = await vdb.similaritySearch('boy ', 2)

const ret = vdb.asRetriever(2, (doc) => doc.metadata.source == './test.txt')
// const ret = Retriver(vdb) // k: 2 number of chunks

// const res1 = ret._getRelevantDocuments()
const res2 = await ret.invoke('boy') // new way to retrive

console.log(res2.map((x) => x.pageContent)[0])

// for (const doc of similaritySearchResults) {
//   console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`)
// }

//
// const vdb = await StoreFileInVDB(path)
// console.log(vdb)
// console.log(await getSemiliraties('Boy', vdb))

// let x = null

// function setx(val) {
//   x = val
// }

// setx(2)

// console.log(x)

// console.log(VDB)

// const db = await StoreFileInVDB('./test.txt')

// // console.log(db)

// setVDB(db)

// console.log(VDB)
