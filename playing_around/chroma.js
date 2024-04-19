import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

const client = new ChromaClient({
    serverUrl: "http://localhost:8000"
});

const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: "your_api_key",
});

const collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: embedder,
});

await collection.add({
    ids: ["id1", "id2"],
    metadatas: [{ source: "my_source" }, { source: "my_source" }],
    documents: ["This is a document", "This is another document"],
});

const results = await collection.query({
    nResults: 2,
    queryTexts: ["This is a query document"],
});

(async () => {
    console.log(results);
})();
// ChromaDB.createCollection({ name: "my_collection" });

// collection.add({
//     documents: ["This is a document", "This is another document"],
//     metadatas: [{ source: "my_source" }, { source: "my_source" }],
//     ids: ["id1", "id2"],
// });

// collection.add({
//     embeddings: [[1.2, 2.3, 4.5], [6.7, 8.2, 9.2]],
//     documents: ["This is a document", "This is another document"],
//     metadatas: [{ source: "my_source" }, { source: "my_source" }],
//     ids: ["id1", "id2"],
// });

// const results = collection.query({
//     queryTexts: ["This is a query document"],
//     nResults: 2,
// });
