# Entity Relationship Diagram (ERD)

## TemplateLab Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    USERS ||--|| USER_PROFILES : has
    USERS ||--o{ TEMPLATES : creates
    USERS ||--o{ PIPELINE_EXECUTIONS : executes
    USERS ||--o{ TEMPLATE_USAGE : generates
    USERS ||--o{ TEMPLATE_RATINGS : rates
    
    TEMPLATES ||--o{ PIPELINES : contains
    TEMPLATES ||--o{ GLOBAL_INPUTS : defines
    TEMPLATES ||--o{ PIPELINE_EXECUTIONS : executes
    TEMPLATES ||--o{ TEMPLATE_USAGE : tracks
    TEMPLATES ||--o{ TEMPLATE_RATINGS : receives
    
    PIPELINES ||--o{ PIPELINE_EXECUTIONS : runs
    
    PIPELINE_EXECUTIONS ||--|| TEMPLATE_USAGE : records

    USERS {
        uuid id PK
        string email UK
        string password_hash
        timestamp created_at
        timestamp updated_at
    }
    
    USER_ROLES {
        uuid id PK
        uuid user_id FK
        enum role
        timestamp created_at
    }
    
    USER_PROFILES {
        uuid user_id PK_FK
        string display_name
        string avatar_url
        text bio
        string subscription_tier
        int credits_remaining
        timestamp created_at
        timestamp updated_at
    }
    
    TEMPLATES {
        uuid id PK
        uuid user_id FK
        string name
        text description
        string category
        boolean is_public
        string thumbnail_url
        decimal rating_average
        int usage_count
        timestamp created_at
        timestamp updated_at
    }
    
    PIPELINES {
        uuid id PK
        uuid template_id FK
        string name
        text description
        jsonb steps
        timestamp created_at
        timestamp updated_at
    }
    
    GLOBAL_INPUTS {
        uuid id PK
        uuid template_id FK
        string input_key UK
        enum input_type
        string label
        text placeholder
        jsonb default_value
        jsonb validation_rules
        timestamp created_at
    }
    
    PIPELINE_EXECUTIONS {
        uuid id PK
        uuid template_id FK
        uuid user_id FK
        jsonb input_data
        enum status
        jsonb results
        text error_message
        timestamp started_at
        timestamp completed_at
        timestamp created_at
    }
    
    TEMPLATE_USAGE {
        uuid id PK
        uuid template_id FK
        uuid user_id FK
        uuid execution_id FK
        int credits_used
        int execution_time_ms
        timestamp created_at
    }
    
    TEMPLATE_RATINGS {
        uuid id PK
        uuid template_id FK
        uuid user_id FK
        int rating
        text review
        timestamp created_at
        timestamp updated_at
    }
```

## Relationships Description

### User Management
- **USERS ↔ USER_ROLES**: One-to-many (A user can have multiple roles)
- **USERS ↔ USER_PROFILES**: One-to-one (Each user has one profile)

### Template Management
- **USERS ↔ TEMPLATES**: One-to-many (A user can create multiple templates)
- **TEMPLATES ↔ PIPELINES**: One-to-many (A template can have multiple pipelines)
- **TEMPLATES ↔ GLOBAL_INPUTS**: One-to-many (A template can define multiple inputs)

### Execution & Analytics
- **USERS ↔ PIPELINE_EXECUTIONS**: One-to-many (A user can execute multiple pipelines)
- **TEMPLATES ↔ PIPELINE_EXECUTIONS**: One-to-many (A template can be executed multiple times)
- **PIPELINE_EXECUTIONS ↔ TEMPLATE_USAGE**: One-to-one (Each execution generates one usage record)

### Ratings & Feedback
- **USERS ↔ TEMPLATE_RATINGS**: One-to-many (A user can rate multiple templates)
- **TEMPLATES ↔ TEMPLATE_RATINGS**: One-to-many (A template can receive multiple ratings)

## Enums

### app_role
- `admin`
- `moderator`
- `user`

### pipeline_step_type
- `image_generation`
- `image_analysis`
- `video_generation`
- `text_generation`
- `image_edit`

### global_input_type
- `text`
- `image`
- `number`
- `select`

### execution_status
- `pending`
- `running`
- `completed`
- `failed`
- `cancelled`

### subscription_tier
- `free`
- `pro`
- `enterprise`

## Indexes

Key indexes for performance:
- `idx_users_email` on users(email)
- `idx_templates_user_id` on templates(user_id)
- `idx_templates_category` on templates(category)
- `idx_templates_is_public` on templates(is_public)
- `idx_pipeline_executions_user_id` on pipeline_executions(user_id)
- `idx_pipeline_executions_status` on pipeline_executions(status)
- `idx_template_usage_template_id` on template_usage(template_id)

## Security

### Row Level Security (RLS)
Implement RLS policies to ensure:
- Users can only view their own private templates
- Users can only execute templates they have access to
- Admin users can access all resources
- Use security definer functions to avoid recursive RLS issues
