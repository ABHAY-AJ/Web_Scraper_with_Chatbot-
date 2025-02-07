// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { Pinecone } = require('@pinecone-database/pinecone');
const Groq = require('groq-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Pinecone setup
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY});
const index = pinecone.Index('scraped-content');

// Groq setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});

// Web Scraping Route
app.post('/scrape', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract text content from paragraphs
        const content = $('p').text();

        // Store content in Pinecone (generate embeddings)
        const embeddings = await generateEmbeddings(content);
       
        const truncatedContent = content.slice(0, 3000);  // Truncating content to fit size limit

        // Insert into Pinecone
        await index.upsert([{
            id: url,
            values: embeddings,
            metadata: { content: truncatedContent }
        }]);

        res.status(200).json({ message: 'Scraping completed!', content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape the website' });
    }
});

// Chat Route
app.post('/chat', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // Retrieve relevant content from Pinecone
        const queryEmbeddings = await generateEmbeddings(query);
        const queryResult = await index.query({
            vector: queryEmbeddings,
            topK: 1,
            includeMetadata: true
        });
        

        // Log the Pinecone result for debugging
        console.log('Pinecone Query Result:', queryResult);

        const relevantContent = queryResult.matches[0]?.metadata?.content || 'No relevant content found';
        console.log('Relevant Content:', relevantContent); // Check the actual content

        // Generate response using Groq API
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Based on the following content: ${relevantContent}, answer the query: ${query}` }
            ]
        });

        res.status(200).json({ response: chatCompletion.choices[0]?.message?.content || "No response generated." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});


// Mock function to generate embeddings
const generateEmbeddings = async (text) => {
    return Array(1536).fill(0).map(() => Math.random());
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
