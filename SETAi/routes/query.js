// imports
// import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
// import { ChatOllama } from "@langchain/ollama";

const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/huggingface_transformers");
const { ChatOllama } = require("@langchain/ollama");


const express = require('express'); // import express framework
const cors = require('cors'); // import cors to enable communication between frontend and backend
const app = express(); // create an express app instance

var router = express.Router();

app.use(cors()); // enable cors to allow requests from different origins
app.use(express.json());


const PORT = 11434;  // Using same port as in your frontend code
app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
});

const CHROMA_PATH = "../chroma/vectorstore";
const ollamaModel = "patient-sim";

const embeddingModel = new HuggingFaceTransformersEmbeddings({
       modelName: "sentence-transformers/all-MiniLM-L6-v2",
});

/**
 * This function embeds the query that is passed to the server
 * into a n-dimensional vector.
 * 
 * @param query - the query or question from the user to be embedded
 * 
 * @returns queryVector - the embedded query
 */
async function embedQuery(query) {
       // embed the query and store it in a variable
       return await embedding_model.embedQuery(query);
}      

/**
 * Load the persistent vectorstore from the server and query it for similar chunks
 * 
 * @param query - the query or question from the user to be embedded
 * 
 * @returns contextForLLM - the 'k' most similar chunks from the vectorstore
 */
async function queryDB(query, collectionName) {
       // embed the query
       const queryVector = await embedQuery(query);

       // load the vector store from the linux box
       const vectorStore = await Chroma.fromExistingCollection(
              embeddingModel,
              {
                     collectionName: collectionName,          // name of the collection to load
                     persistDirectory: CHROMA_PATH,     // path to the "on-disk" vectorstore
              }
       );
       // query the colletion for the "k" most relevant chunks
       const contextForLLM = await vectorStore.similaritySearchVectorWithScore(queryVector, 4);

       return contextForLLM.map(([doc]) => doc.pageContent);
}

/**
 * 
 * @param query - the question from the user (from frontend)
 * @param context - context pulled from the vectorstore 
 * @returns response.content - the response generated from the LLM 
 *          based on the context and answering the user's question
 */
async function askOllama(query, context) {
       const llm = new ChatOllama({
              model: ollamaModel,
       });

       const modelPrompt = `
       Use the following medical context to respond appropriately:
       ${context.join("\n\n")}

       Answer the following question using the given context:
       Question: ${query}
       `;

       const response = await llm.invoke(modelPrompt);
       return response.content;
}

// express route to handle chatbot queries
app.post("/chat", async (req, res) => {
       try {
           const { query } = req.body;
           const { collectionName } = req.body.collectionName;
   
           // 1st: retrieve relevant context from the persistent vector store
           const context = await queryDB(query, collectionName);
   
           // 2nd: generate an AI response using the retrieved context
           const response = await queryOllama(query, context);
   
           res.json({ response });
   
       } catch (error) {
           console.error("Error processing request:", error);
           res.status(500).json({ error: "Internal query error" });
       }
});

module.exports = router;