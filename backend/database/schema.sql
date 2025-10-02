-- TemplateLab Database Schema
-- PostgreSQL Database Structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USER MANAGEMENT
-- =====================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- User roles enum
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table (for RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    credits_remaining INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- TEMPLATES
-- =====================

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    thumbnail_url TEXT,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_is_public ON templates(is_public);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);

-- =====================
-- PIPELINES
-- =====================

-- Pipeline step types enum
CREATE TYPE pipeline_step_type AS ENUM (
    'image_generation',
    'image_analysis',
    'video_generation',
    'text_generation',
    'image_edit'
);

-- Pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pipelines_template_id ON pipelines(template_id);

-- =====================
-- GLOBAL INPUTS
-- =====================

-- Global input types enum
CREATE TYPE global_input_type AS ENUM ('text', 'image', 'number', 'select');

-- Global inputs table
CREATE TABLE IF NOT EXISTS global_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    input_key VARCHAR(100) NOT NULL,
    input_type global_input_type NOT NULL,
    label VARCHAR(200) NOT NULL,
    placeholder TEXT,
    default_value JSONB,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, input_key)
);

CREATE INDEX idx_global_inputs_template_id ON global_inputs(template_id);

-- =====================
-- PIPELINE EXECUTION
-- =====================

-- Execution status enum
CREATE TYPE execution_status AS ENUM (
    'pending',
    'running',
    'completed',
    'failed',
    'cancelled'
);

-- Pipeline executions table
CREATE TABLE IF NOT EXISTS pipeline_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    status execution_status DEFAULT 'pending',
    results JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pipeline_executions_template_id ON pipeline_executions(template_id);
CREATE INDEX idx_pipeline_executions_user_id ON pipeline_executions(user_id);
CREATE INDEX idx_pipeline_executions_status ON pipeline_executions(status);
CREATE INDEX idx_pipeline_executions_started_at ON pipeline_executions(started_at DESC);

-- =====================
-- USAGE & ANALYTICS
-- =====================

-- Template usage table
CREATE TABLE IF NOT EXISTS template_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL REFERENCES pipeline_executions(id) ON DELETE CASCADE,
    credits_used INTEGER NOT NULL DEFAULT 1,
    execution_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX idx_template_usage_user_id ON template_usage(user_id);
CREATE INDEX idx_template_usage_created_at ON template_usage(created_at DESC);

-- Template ratings table
CREATE TABLE IF NOT EXISTS template_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

CREATE INDEX idx_template_ratings_template_id ON template_ratings(template_id);
CREATE INDEX idx_template_ratings_user_id ON template_ratings(user_id);

-- =====================
-- TRIGGERS
-- =====================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_ratings_updated_at BEFORE UPDATE ON template_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- FUNCTIONS
-- =====================

-- Function to check user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
        AND role = _role
    );
$$;

-- Function to update template rating average
CREATE OR REPLACE FUNCTION update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE templates
    SET rating_average = (
        SELECT COALESCE(AVG(rating), 0)
        FROM template_ratings
        WHERE template_id = NEW.template_id
    )
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_rating_trigger
    AFTER INSERT OR UPDATE ON template_ratings
    FOR EACH ROW EXECUTE FUNCTION update_template_rating();

-- =====================
-- SAMPLE DATA (Optional)
-- =====================

-- Uncomment below to insert sample data for testing

/*
-- Create sample user
INSERT INTO users (id, email, password_hash) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS.sKkh.O');

-- Add user role
INSERT INTO user_roles (user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'user');

-- Create user profile
INSERT INTO user_profiles (user_id, display_name, subscription_tier, credits_remaining) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'free', 100);

-- Create sample template
INSERT INTO templates (id, user_id, name, description, category, is_public) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 
     'Image Generation Template', 'Generate beautiful images from text prompts', 
     'Design', true);
*/
