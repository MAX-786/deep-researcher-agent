# Deep Researcher Agent

A powerful AI research assistant that helps with complex research topics. This application follows a microservices architecture with a Next.js frontend and a Node.js backend.

## Project Structure

- **web/** - Next.js frontend application
- **server/** - Node.js backend API server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd web
npm install
# or
pnpm install

# Install backend dependencies
cd ../server
npm install
# or
pnpm install
```

3. Set up environment variables:

```bash
# For frontend
cp web/.env.example web/.env.local

# For backend
cp server/.env.example server/.env
```

4. Update the environment variables with your configuration

### Running the Application

You can use the provided script to start both the frontend and backend servers:

```bash
chmod +x start-dev.sh
./start-dev.sh
```

Or run them separately:

```bash
# Start the backend server
cd server
npm run dev

# Start the frontend server
cd web
npm run dev
```

## Features

- **Authentication** - User login with JWT tokens
- **Chat Interface** - Ask complex research questions
- **File Upload** - Upload PDF documents for analysis
- **Document Context** - Get AI responses based on uploaded documents

## Architecture

This application follows a microservices architecture with the following components:

1. **API Gateway Layer** - Entry point for all client requests
2. **Authentication Service** - Manages user authentication and session management
3. **Chat Controller Service** - Handles chat-related operations
4. **LLM Proxy Service** - Interfaces with the LLM server
5. **Database Service** - Stores user data, chat history, and other persistent information
6. **Logging and Monitoring Service** - Tracks application performance and errors

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate user & get token

### Chat

- `POST /api/chat` - Process a chat message and get AI response
- `POST /api/chat/with-context` - Process a chat message with document context

### Document Upload

- `POST /api/upload` - Upload a PDF document
- `GET /api/upload/:id` - Get document information

## Development

### Frontend (Next.js)

The frontend is built with Next.js and uses the following technologies:

- **React** - UI library
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library

### Backend (Node.js)

The backend is built with Node.js and Express and uses the following technologies:

- **Express** - Web framework
- **JWT** - Authentication
- **Winston** - Logging
- **Multer** - File uploads

## Security Considerations

- JWT-based authentication
- Secure cookie storage for tokens
- Rate limiting to prevent abuse
- Input validation and sanitization
- Error handling that doesn't expose sensitive information