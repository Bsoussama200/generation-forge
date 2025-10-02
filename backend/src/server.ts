import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { pool } from './config/database';
import { connectRedis } from './config/redis';
import { AppError, handleError } from './utils/errors';
import { rateLimit } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/auth';
import templateRoutes from './routes/templates';
import pipelineRoutes from './routes/pipelines';
import userRoutes from './routes/users';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimit);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1', pipelineRoutes);
app.use('/api/v1/users', userRoutes);

// Serve uploaded files
app.use('/storage', express.static(config.storage.path));

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global error handler
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');

    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Start listening
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`);
      console.log(`📝 Environment: ${config.server.env}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();

export default app;
