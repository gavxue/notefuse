# notefuse ✨

An AI-powered chatbot that assists with summarizing notes and study materials.

## Technologies
- Next.js: frontend and API routes
- Supabase: relational database for storing chats and messages
- AWS S3: file storage for PDFs
- Pinecone: vector database for storing embeddings
- OpenAI GPT-4o: generating intelligent responses from input and context
- Langchain: creating vector embedding for RAG

## Design
![notefuse_diagram](https://github.com/user-attachments/assets/38aba74e-61f9-48fa-a9b5-8470576c8f04)

## Challenges
- engineering a good prompt for LLM with the relevant context
- fine-tuning chunk sizes and embedding parameters for the best balance between context precision and token usage
- setting up S3 on the AWS management console

## Features to be added
- multiple document upload for an individual chat
- public chat where multiple users can engage together in a chat
- study plan generator (quiz, flashcards, concept map)
