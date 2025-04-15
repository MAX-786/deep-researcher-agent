# Deep Researcher Server

Backend API server for the Deep Researcher Agent application.

## Architecture

This server follows a modular microservices pattern with the following components:

1. **API Gateway Layer** - Entry point for all client requests
2. **Authentication Service** - Manages user authentication and session management
3. **Chat Controller Service** - Handles chat-related operations
4. **LLM Proxy Service** - Interfaces with the LLM server
5. **Database Service** - Stores user data, chat history, and other persistent information
6. **Logging and Monitoring Service** - Tracks application performance and errors

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
# or
pnpm install
```

4. Copy the environment variables file:

```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration

### Running the Server

Development mode:

```bash
npm run dev
# or
pnpm dev
```

Production mode:

```bash
npm start
# or
pnpm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate user & get token

### Chat

- `POST /api/chat` - Process a chat message and get AI response
- `POST /api/chat/with-context` - Process a chat message with document context

### Document Upload

- `POST /api/upload` - Upload a PDF document
- `GET /api/upload/:id` - Get document information

## Folder Structure

```
server/
├── src/
│   ├── index.js           # Entry point
│   ├── middleware/        # Middleware functions
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── uploads/               # Document storage
├── logs/                  # Log files
├── .env.example           # Example environment variables
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Security Considerations

- JWT-based authentication
- Rate limiting to prevent abuse
- Helmet for HTTP security headers
- Input validation and sanitization
- Error handling that doesn't expose sensitive information
