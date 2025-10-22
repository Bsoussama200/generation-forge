# FlexFlow Backend API

Node.js/Express backend for the FlexFlow Template & Pipeline Builder Platform.

## Architecture

This backend follows a layered architecture:

```
├── config/          # Configuration (database, env, redis)
├── models/          # Database models (not implemented, using raw SQL)
├── services/        # Business logic layer
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── middleware/      # Auth, validation, rate limiting
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT with bcrypt
- **Validation**: express-validator
- **AI Services**: 
  - Gemini Nano Banana (google/gemini-2.5-flash-image-preview)
  - Veo3 (Video generation)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Required environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `JWT_SECRET` - Secret for JWT token signing
- `GEMINI_API_KEY` - API key for Gemini AI services
- `VEO3_API_KEY` - API key for Veo3 video generation

### 3. Set Up Database

Run the database schema migration:

```bash
psql -U postgres -d flexflow -f database/schema.sql
```

Or connect to your PostgreSQL instance and execute the SQL file manually.

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify` - Verify JWT token

### Templates
- `POST /api/v1/templates` - Create template (auth required)
- `GET /api/v1/templates` - List templates
- `GET /api/v1/templates/:id` - Get template by ID
- `PATCH /api/v1/templates/:id` - Update template (auth required)
- `DELETE /api/v1/templates/:id` - Delete template (auth required)

### Pipelines
- `POST /api/v1/templates/:templateId/pipelines` - Create pipeline (auth required)
- `GET /api/v1/templates/:templateId/pipelines` - List pipelines
- `GET /api/v1/pipelines/:id` - Get pipeline by ID
- `PATCH /api/v1/pipelines/:id` - Update pipeline (auth required)
- `DELETE /api/v1/pipelines/:id` - Delete pipeline (auth required)

### Pipeline Execution
- `POST /api/v1/templates/:templateId/execute` - Execute pipeline (auth required)
- `GET /api/v1/executions/:executionId` - Get execution status (auth required)

### Users
- `GET /api/v1/users/profile` - Get user profile (auth required)
- `PATCH /api/v1/users/profile` - Update user profile (auth required)
- `GET /api/v1/users/usage` - Get usage statistics (auth required)

## AI Service Integration

### TODO: Complete AI Service Implementation

The backend includes placeholder implementations for AI services that need to be completed:

#### 1. Gemini Nano Banana (Image Generation & Analysis)

**Location**: `src/services/AIService.ts`

**Methods to implement**:
- `generateImage()` - Generate images from text prompts
- `analyzeImage()` - Analyze images and extract information
- `editImage()` - Edit existing images with AI

**API Details**:
- Endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-2.5-flash-image-preview`
- Authorization: Bearer token with GEMINI_API_KEY

**Example Request**:
```typescript
{
  "model": "google/gemini-2.5-flash-image-preview",
  "messages": [{
    "role": "user",
    "content": "Generate a sunset over mountains"
  }],
  "modalities": ["image", "text"]
}
```

#### 2. Veo3 Video Generation

**Location**: `src/services/AIService.ts`

**Methods to implement**:
- `generateVideo()` - Generate videos from prompts/images
- `checkVideoStatus()` - Poll for video generation completion

**Notes**:
- Video generation is typically async (job-based)
- Implement polling mechanism for job status
- Store job IDs in Redis for status tracking

### Storage Service

**Location**: `src/services/StorageService.ts`

**TODO**: Integrate cloud storage (AWS S3, Google Cloud Storage, etc.)

Currently uses local file system. Production should use:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudinary (for images)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Rate limiting (Redis-based)
- Input validation
- SQL injection protection (parameterized queries)
- CORS configuration
- Helmet security headers

## Database Design

See `database/schema.sql` for complete schema.

Key tables:
- `users` - User accounts
- `user_roles` - Role-based access control
- `user_profiles` - User profile data
- `templates` - Template definitions
- `pipelines` - Pipeline configurations
- `global_inputs` - Template input definitions
- `pipeline_executions` - Execution tracking
- `template_usage` - Usage analytics
- `template_ratings` - User ratings

## Caching Strategy

Redis is used for:
- Rate limiting
- Pipeline execution status
- Session management
- Popular templates (TODO)
- User session data (TODO)

## Error Handling

The backend uses a centralized error handling approach:

- Custom `AppError` class for operational errors
- Global error handler middleware
- Async error wrapper for route handlers
- Proper HTTP status codes

## Development

### Adding New Routes

1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add route to `src/server.ts`
4. Add validation middleware if needed

### Adding New Services

1. Create service in `src/services/`
2. Add type definitions in `src/types/`
3. Inject service in controllers

## Testing

TODO: Add testing framework

Recommended:
- Jest for unit tests
- Supertest for API tests
- Test database setup

## Deployment

### Environment Variables

Ensure all required environment variables are set in production.

### Database Migrations

Use a migration tool like:
- Knex.js
- Sequelize migrations
- Custom migration scripts

### Process Management

Use PM2 or similar for production:

```bash
npm install -g pm2
pm2 start dist/server.js --name flexflow-api
```

## License

MIT
