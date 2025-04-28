// imports

const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { HuggingFaceTransformersEmbeddings } = require("@langchain/community/embeddings/huggingface_transformers");
const { ChatOllama } = require("@langchain/ollama");
const { ChromaClient } = require("chromadb");


const express = require('express'); // import express framework
const cors = require('cors'); // import cors to enable communication between frontend and backend
const app = express(); // create an express app instance

var router = express.Router();
var chromaClient;

app.use(cors()); // enable cors to allow requests from different origins
app.use(express.json());

//Ensure this port matches with front-end
const PORT = 11434;
 //model name, make sure this matches the model name running on the physcial machine
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
       //var realQuery = query.String();
       return await embeddingModel.embedQuery(query);
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
       if (typeof query === 'string' && query.length != 0) { //validation check on string
              const queryVector = await embedQuery(query);

              const vectorStore = new Chroma(
                     embeddingModel,
                     {
                            collectionName: collectionName,
                            url: "http://localhost:8000"
                     }
              );

              const contextForLLM = await vectorStore.similaritySearchVectorWithScore(queryVector, 4);

              return contextForLLM.map(([doc]) => doc.pageContent);
       } else {
              return;
       }
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
router.post('/', async (req, res) => {
       console.log("Query: ", req.body);
       try {
              const { query, collectionName } = req.body;
       //     const { query } = req.query;
       //     //req.body.collectionName
       //     const { collectionName } = req.collectionName;
   
           // 1st: retrieve relevant context from the persistent vector store
           const context = await queryDB(query, collectionName);
   
           // 2nd: generate an AI response using the retrieved context
           const response = await askOllama(query, context);
   
           res.json({ response });
   
       } catch (error) {
           console.error("Error processing request:", error);
           res.status(500).json({ error: "Internal query error" });
       }
});

module.exports = router;