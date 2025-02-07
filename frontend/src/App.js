// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const api = "https://web-scraper-with-chatbot.onrender.com"
    const [url, setUrl] = useState('');
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleScrape = async () => {
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${api}/scrape`, { url });
            alert('Scraping completed!');
        } catch (error) {
            alert('Failed to scrape the website(use correct url)');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChat = async () => {
        if (!query) {
            alert('Please enter a question');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${api}/chat`, { query });
            setResponse(res.data.response);
        } catch (error) {
            alert('Failed to generate response');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Web Scraper with Chatbot</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={handleScrape} disabled={isLoading}>
                    {isLoading ? 'Scraping...' : 'Scrape'}
                </button>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Ask a question"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleChat} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Ask'}
                </button>
            </div>
            {response && (
                <div className="response-container">
                    <h3>Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default App;