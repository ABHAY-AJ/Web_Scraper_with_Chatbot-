# Web Scraper with Chatbot

## 🚀 Overview
This project is a **web scraper with an AI-powered chatbot**, built using **Node.js, Express, React, Pinecone, Groq API, and Cheerio**. The application allows users to **scrape a website for text content**, store it in **Pinecone vector database**, and later **ask questions** related to the scraped content. The chatbot uses **Groq API** for generating responses based on the relevant retrieved content.

---

## 🛠️ Technical Details

### **Frontend (React)**
- **Framework**: React.js
- **State Management**: useState (React Hooks)
- **HTTP Requests**: Axios
- **Styling**: Responsive CSS with modern UI enhancements
- **Features**:
  - Input fields for **URL scraping** and **chat queries**
  - Buttons for scraping and chatbot interactions
  - Loading states to enhance user experience

### **Backend (Node.js & Express)**
- **Framework**: Express.js
- **Scraping**: Cheerio (Extracts text content from a webpage)
- **Vector Database**: Pinecone (Stores scraped content as embeddings for retrieval)
- **LLM API**: Groq API (Generates chatbot responses based on retrieved content)
- **CORS**: Enabled for frontend-backend communication
- **Environment Variables**: Handled using `.env`
- **Endpoints**:
  - `POST /scrape`: Scrapes the given URL, extracts content, and stores it in Pinecone
  - `POST /chat`: Queries Pinecone for relevant content and uses Groq API to generate an answer

---

## API Usage

### **1️⃣ Scraping a Website**
**Endpoint:** `POST /scrape`
- **Request Body:**
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Scraping completed!",
    "content": "Extracted text from the website..."
  }
  ```

### **2️⃣ Asking a Question**
**Endpoint:** `POST /chat`
- **Request Body:**
  ```json
  {
    "query": "What is the main topic of the website?"
  }
  ```
- **Response Example:**
  ```json
  {
    "response": "The website primarily discusses AI advancements in 2025."
  }
  ```

---

## 💡 Example Chatbot Responses
| **User Query** | **Chatbot Response** |
|---------------|----------------------|
| "What is the website about?" | "The website primarily discusses AI and automation." |
| "Who is the author?" | "The author details were not found in the extracted content." |
| "Summarize the content." | "The webpage focuses on AI trends and their impact on various industries." |

---

## Edge Cases Considered & Handled
### ✅ **Handled Edge Cases:**
- **Invalid or missing URL**: Returns a `400` error with `"URL is required"`.
- **Website is down or inaccessible**: Returns a `500` error with `"Failed to scrape the website"`.
- **No text content found on the page**: Returns `"No relevant content found"` in response.
- **Empty or irrelevant chatbot queries**: If Pinecone finds no matching data, Groq responds generically.
- **Handling API failures**: If Groq or Pinecone API fails, it returns a `"Failed to generate response"` message.

### ❌ **Edge Cases Not Handled (Yet!)**
- **JavaScript-rendered content**: The scraper does not execute JavaScript, so it may miss dynamically loaded content.
- **Multiple pages scraping**: Currently, only **one page** is scraped at a time (pagination not supported).
- **Rate limiting for API calls**: No rate limit has been implemented yet to prevent abuse.
- **Duplicate URLs in Pinecone**: No deduplication logic is implemented for storing multiple scrapes of the same URL.

---

## How to Run the Project

### **1️⃣ Backend Setup**
1. Clone the repository:
   ```sh
   git clone https://github.com/ABHAY-AJ/Web_Scraper_with_Chatbot-.git
   cd Web_Scraper_with_Chatbot-
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your API keys:
   ```sh
   PINECONE_API_KEY=your_pinecone_key
   GROQ_API_KEY=your_groq_key
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```

### **2️⃣ Frontend Setup**
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```

Now, open [http://localhost:3000](http://localhost:3000) to use the application!

