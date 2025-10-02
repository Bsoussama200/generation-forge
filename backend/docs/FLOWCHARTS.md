# System Flowcharts

## 1. User Authentication Flow

```mermaid
flowchart TD
    A[User Opens App] --> B{Authenticated?}
    B -->|No| C[Show Login/Register Page]
    B -->|Yes| D[Load Dashboard]
    
    C --> E{Action?}
    E -->|Register| F[Submit Email + Password]
    E -->|Login| G[Submit Credentials]
    
    F --> H[POST /api/v1/auth/register]
    G --> I[POST /api/v1/auth/login]
    
    H --> J{Valid?}
    I --> J
    
    J -->|No| K[Show Error Message]
    K --> C
    
    J -->|Yes| L[Create User Record]
    L --> M[Generate JWT Token]
    M --> N[Create User Profile]
    N --> O[Assign Default Role]
    O --> P[Return Token + User Data]
    P --> Q[Store Token in localStorage]
    Q --> D
    
    D --> R[Access Protected Routes]
```

## 2. Template Creation Flow

```mermaid
flowchart TD
    A[User Clicks Create Template] --> B[Enter Template Details]
    B --> C[Add Name, Description, Category]
    C --> D[Configure Global Inputs]
    
    D --> E{Input Type?}
    E -->|Text| F[Add Text Input Config]
    E -->|Image| G[Add Image Input Config]
    E -->|Number| H[Add Number Input Config]
    E -->|Select| I[Add Select Input Config]
    
    F --> J[Save Input Configuration]
    G --> J
    H --> J
    I --> J
    
    J --> K[Create Pipeline Steps]
    K --> L{Step Type?}
    
    L -->|Image Generation| M[Configure Prompt & Dimensions]
    L -->|Image Analysis| N[Configure Analysis Prompt]
    L -->|Video Generation| O[Configure Video Settings]
    L -->|Text Generation| P[Configure Text Parameters]
    
    M --> Q[Add Step to Pipeline]
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R{More Steps?}
    R -->|Yes| K
    R -->|No| S[Review Configuration]
    
    S --> T[POST /api/v1/templates]
    T --> U[Save Template to Database]
    U --> V[POST /api/v1/templates/:id/pipelines]
    V --> W[Save Pipeline Configuration]
    W --> X[Save Global Inputs]
    X --> Y[Return Template ID]
    Y --> Z[Redirect to Template Page]
```

## 3. Pipeline Execution Flow

```mermaid
flowchart TD
    A[User Selects Template] --> B[Load Template Details]
    B --> C[GET /api/v1/templates/:id]
    C --> D[Display Global Input Form]
    
    D --> E[User Fills Inputs]
    E --> F{All Required Inputs?}
    F -->|No| G[Show Validation Errors]
    G --> E
    
    F -->|Yes| H[Click Execute]
    H --> I[POST /api/v1/templates/:id/execute]
    
    I --> J[Create Execution Record]
    J --> K[Set Status: RUNNING]
    K --> L[Deduct User Credits]
    L --> M[Return Execution ID]
    
    M --> N[Start Background Processing]
    N --> O[Load Pipeline Steps]
    O --> P[Initialize Results Object]
    
    P --> Q{For Each Step}
    Q --> R{Step Type?}
    
    R -->|Image Generation| S[Call Gemini Nano Banana API]
    R -->|Image Analysis| T[Call Gemini Analysis API]
    R -->|Video Generation| U[Call Veo3 API]
    R -->|Text Generation| V[Call Text Generation API]
    
    S --> W[Store Step Result]
    T --> W
    U --> W
    V --> W
    
    W --> X{More Steps?}
    X -->|Yes| Q
    X -->|No| Y[Combine All Results]
    
    Y --> Z[Update Execution Status: COMPLETED]
    Z --> AA[Save Results to Database]
    AA --> AB[Record Usage Analytics]
    AB --> AC[Update Template Usage Count]
    AC --> AD[Cache Results in Redis]
    
    AD --> AE[Frontend Polls Status]
    AE --> AF[GET /api/v1/executions/:id]
    AF --> AG{Status?}
    AG -->|Running| AH[Show Progress]
    AH --> AE
    AG -->|Completed| AI[Display Results]
    AG -->|Failed| AJ[Show Error Message]
```

## 4. AI Service Integration Flow

```mermaid
flowchart TD
    A[Pipeline Step Execution] --> B{Step Type?}
    
    B -->|Image Generation| C[Prepare Image Gen Request]
    C --> D[Build Gemini Request]
    D --> E[Model: gemini-2.5-flash-image-preview]
    E --> F[Add User Prompt]
    F --> G[Set Modalities: image, text]
    G --> H[POST to Lovable AI Gateway]
    
    H --> I{Success?}
    I -->|No| J[Handle API Error]
    J --> K[Return Error to Pipeline]
    
    I -->|Yes| L[Extract Base64 Image]
    L --> M[Upload to Storage Service]
    M --> N[Get Permanent URL]
    N --> O[Return Image URL]
    
    B -->|Image Analysis| P[Prepare Analysis Request]
    P --> Q[Build Gemini Request]
    Q --> R[Model: gemini-2.5-flash]
    R --> S[Add Image URL]
    S --> T[Add Analysis Prompt]
    T --> U[POST to Lovable AI Gateway]
    
    U --> V{Success?}
    V -->|No| J
    V -->|Yes| W[Extract Analysis Text]
    W --> X[Return Analysis Result]
    
    B -->|Video Generation| Y[Prepare Video Gen Request]
    Y --> Z[Build Veo3 Request]
    Z --> AA[Add Prompt]
    AA --> AB[Add Input Image if exists]
    AB --> AC[Set Duration]
    AC --> AD[POST to Veo3 API]
    
    AD --> AE{Async Job?}
    AE -->|Yes| AF[Get Job ID]
    AF --> AG[Store Job ID in Redis]
    AG --> AH[Poll Job Status]
    AH --> AI{Complete?}
    AI -->|No| AJ[Wait & Retry]
    AJ --> AH
    AI -->|Yes| AK[Get Video URL]
    AK --> AL[Return Video URL]
    
    O --> AM[Continue Pipeline]
    X --> AM
    AL --> AM
```

## 5. Rate Limiting & Caching Flow

```mermaid
flowchart TD
    A[Incoming API Request] --> B[Extract Client IP]
    B --> C[Check Redis Rate Limit]
    C --> D{Limit Exceeded?}
    
    D -->|Yes| E[Return 429 Too Many Requests]
    E --> F[Set Retry-After Header]
    
    D -->|No| G[Increment Request Counter]
    G --> H[Set Expiry if New]
    H --> I[Process Request]
    
    I --> J{Cacheable?}
    J -->|Yes| K{Cache Hit?}
    K -->|Yes| L[Return Cached Data]
    K -->|No| M[Execute Query]
    M --> N[Store in Redis]
    N --> O[Set Cache TTL]
    O --> P[Return Data]
    
    J -->|No| M
    
    P --> Q[Log Request]
    Q --> R[Update Analytics]
```

## 6. File Upload & Storage Flow

```mermaid
flowchart TD
    A[User Uploads File] --> B[Multer Middleware]
    B --> C{File Valid?}
    
    C -->|No| D[Return Validation Error]
    C -->|Yes| E[Generate Unique File ID]
    
    E --> F[Create User Directory]
    F --> G[Save to Local Storage]
    
    G --> H{Cloud Storage Enabled?}
    H -->|Yes| I[Upload to S3/GCS]
    I --> J[Get Cloud URL]
    J --> K[Delete Local File]
    K --> L[Return Cloud URL]
    
    H -->|No| M[Return Local URL]
    
    L --> N[Store URL in Database]
    M --> N
    
    N --> O[Return File URL to Client]
```

## 7. Error Handling Flow

```mermaid
flowchart TD
    A[Request Enters System] --> B[Try Block]
    B --> C{Error Occurs?}
    
    C -->|No| D[Execute Controller Logic]
    D --> E[Execute Service Logic]
    E --> F[Return Success Response]
    
    C -->|Yes| G{Error Type?}
    
    G -->|AppError| H[Operational Error]
    H --> I[Extract Status Code]
    I --> J[Extract Error Message]
    J --> K[Return JSON Error]
    
    G -->|Database Error| L[Log Full Error]
    L --> M[Return Generic Error]
    
    G -->|Validation Error| N[Extract Validation Messages]
    N --> O[Return 400 Bad Request]
    
    G -->|Auth Error| P[Return 401 Unauthorized]
    
    G -->|Unknown| Q[Log Error Details]
    Q --> R[Return 500 Internal Server Error]
    
    K --> S[Send Response]
    M --> S
    O --> S
    P --> S
    R --> S
```

## Architecture Overview

```mermaid
flowchart TB
    subgraph Client
        A[React Frontend]
    end
    
    subgraph API_Layer
        B[Express Server]
        C[Auth Middleware]
        D[Rate Limiter]
        E[Validation]
    end
    
    subgraph Controllers
        F[Auth Controller]
        G[Template Controller]
        H[Pipeline Controller]
        I[User Controller]
    end
    
    subgraph Services
        J[Auth Service]
        K[Template Service]
        L[Pipeline Service]
        M[AI Service]
        N[Storage Service]
    end
    
    subgraph External
        O[Gemini API]
        P[Veo3 API]
        Q[Cloud Storage]
    end
    
    subgraph Data
        R[(PostgreSQL)]
        S[(Redis Cache)]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
    
    F --> J
    G --> K
    H --> L
    
    J --> R
    K --> R
    L --> R
    L --> M
    
    M --> O
    M --> P
    N --> Q
    
    K --> S
    L --> S
    D --> S
```
