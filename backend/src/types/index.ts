import { Request } from 'express';

// User Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  credits_remaining: number;
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

// Template Types
export interface Template {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  is_public: boolean;
  thumbnail_url?: string;
  rating_average?: number;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

// Pipeline Types
export enum PipelineStepType {
  IMAGE_GENERATION = 'image_generation',
  IMAGE_ANALYSIS = 'image_analysis',
  VIDEO_GENERATION = 'video_generation',
  TEXT_GENERATION = 'text_generation',
  IMAGE_EDIT = 'image_edit'
}

export interface PipelineStep {
  id: string;
  step_order: number;
  step_type: PipelineStepType;
  config: Record<string, any>;
  depends_on_step_id?: string;
}

export interface Pipeline {
  id: string;
  template_id: string;
  name: string;
  description?: string;
  steps: PipelineStep[];
  created_at: Date;
  updated_at: Date;
}

// Global Input Types
export enum GlobalInputType {
  TEXT = 'text',
  IMAGE = 'image',
  NUMBER = 'number',
  SELECT = 'select'
}

export interface GlobalInput {
  id: string;
  template_id: string;
  input_key: string;
  input_type: GlobalInputType;
  label: string;
  placeholder?: string;
  default_value?: any;
  validation_rules?: Record<string, any>;
  created_at: Date;
}

// Pipeline Execution Types
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface PipelineExecution {
  id: string;
  template_id: string;
  user_id: string;
  input_data: Record<string, any>;
  status: ExecutionStatus;
  results?: Record<string, any>;
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
}

// Usage & Analytics Types
export interface TemplateUsage {
  id: string;
  template_id: string;
  user_id: string;
  execution_id: string;
  credits_used: number;
  execution_time_ms: number;
  created_at: Date;
}

export interface TemplateRating {
  id: string;
  template_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: Date;
}

// Auth Types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: UserRole[];
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  roles: UserRole[];
}

// AI Service Types
export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  generationId: string;
}

export interface ImageAnalysisRequest {
  imageUrl: string;
  prompt: string;
  model?: string;
}

export interface ImageAnalysisResponse {
  analysis: string;
  metadata?: Record<string, any>;
}

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  inputImageUrl?: string;
  model?: string;
}

export interface VideoGenerationResponse {
  videoUrl: string;
  generationId: string;
  status: 'processing' | 'completed' | 'failed';
}

// Error Types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
