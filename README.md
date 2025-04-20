# notefuse ✨

An AI-powered chatbot that assists with summarizing notes and study materials.

## Technologies
- Next.js: frontend and API routes
- Supabase: relational database for storing chats and messages
- Redis: in-memory key-value database for caching chat messages to optimize load speeds
- AWS S3: file storage for PDFs
- Pinecone: vector database for storing embeddings
- OpenAI GPT-4o: generating intelligent responses from input and context
- Langchain: creating vector embedding for RAG

## Design
![notefuse diagram](https://github.com/user-attachments/assets/049f6234-a06f-414b-b159-04eddeb02bbf)



## Challenges
- engineering a good prompt for LLM with the relevant context
- fine-tuning chunk sizes and embedding parameters for the best balance between context precision and token usage
- setting up S3 on the AWS management console

## Features to be added
- multiple document upload for an individual chat
- public chat where multiple users can engage together in a chat
- study plan generator (quiz, flashcards, concept map)
