import { v4 as uuidv4 } from 'uuid';
import { query, getClient } from '../config/database';
import {
  Pipeline,
  PipelineExecution,
  ExecutionStatus,
  AppError,
  PipelineStepType,
} from '../types';
import { AIService } from './AIService';
import { redis } from '../config/redis';

export class PipelineService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async createPipeline(
    templateId: string,
    data: Partial<Pipeline>
  ): Promise<Pipeline> {
    const id = uuidv4();
    const result = await query(
      `INSERT INTO pipelines 
       (id, template_id, name, description, steps) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        id,
        templateId,
        data.name,
        data.description || null,
        JSON.stringify(data.steps || []),
      ]
    );

    return {
      ...result.rows[0],
      steps: result.rows[0].steps,
    };
  }

  async getPipeline(pipelineId: string): Promise<Pipeline> {
    const result = await query('SELECT * FROM pipelines WHERE id = $1', [
      pipelineId,
    ]);

    if (result.rows.length === 0) {
      throw new AppError('Pipeline not found', 404);
    }

    return {
      ...result.rows[0],
      steps: result.rows[0].steps,
    };
  }

  async listPipelines(templateId: string): Promise<Pipeline[]> {
    const result = await query(
      'SELECT * FROM pipelines WHERE template_id = $1 ORDER BY created_at DESC',
      [templateId]
    );

    return result.rows.map(row => ({
      ...row,
      steps: row.steps,
    }));
  }

  async updatePipeline(
    pipelineId: string,
    data: Partial<Pipeline>
  ): Promise<Pipeline> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }

    if (data.steps !== undefined) {
      updateFields.push(`steps = $${paramIndex}`);
      params.push(JSON.stringify(data.steps));
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    updateFields.push(`updated_at = NOW()`);

    const result = await query(
      `UPDATE pipelines 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      [...params, pipelineId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Pipeline not found', 404);
    }

    return {
      ...result.rows[0],
      steps: result.rows[0].steps,
    };
  }

  async deletePipeline(pipelineId: string): Promise<void> {
    const result = await query('DELETE FROM pipelines WHERE id = $1', [
      pipelineId,
    ]);

    if (result.rowCount === 0) {
      throw new AppError('Pipeline not found', 404);
    }
  }

  /**
   * Execute a pipeline with the given input data
   * This orchestrates all steps in the pipeline
   */
  async executePipeline(
    templateId: string,
    userId: string,
    inputData: Record<string, any>
  ): Promise<PipelineExecution> {
    const executionId = uuidv4();
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Create execution record
      await client.query(
        `INSERT INTO pipeline_executions 
         (id, template_id, user_id, input_data, status, started_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [executionId, templateId, userId, JSON.stringify(inputData), ExecutionStatus.RUNNING]
      );

      await client.query('COMMIT');

      // Cache execution status
      await redis.set(`execution:${executionId}`, JSON.stringify({
        status: ExecutionStatus.RUNNING,
        progress: 0,
      }), { EX: 3600 });

      // Execute pipeline asynchronously
      this.runPipelineSteps(executionId, templateId, inputData).catch(error => {
        console.error('Pipeline execution error:', error);
        this.updateExecutionStatus(executionId, ExecutionStatus.FAILED, undefined, error.message);
      });

      return {
        id: executionId,
        template_id: templateId,
        user_id: userId,
        input_data: inputData,
        status: ExecutionStatus.RUNNING,
        started_at: new Date(),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Run pipeline steps sequentially
   * TODO: Implement parallel execution for independent steps
   */
  private async runPipelineSteps(
    executionId: string,
    templateId: string,
    inputData: Record<string, any>
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Get pipeline steps
      const pipelinesResult = await query(
        'SELECT steps FROM pipelines WHERE template_id = $1',
        [templateId]
      );

      if (pipelinesResult.rows.length === 0) {
        throw new AppError('No pipeline found for template', 404);
      }

      const steps = pipelinesResult.rows[0].steps;
      const results: Record<string, any> = {};

      // Execute each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Update progress
        await redis.set(`execution:${executionId}`, JSON.stringify({
          status: ExecutionStatus.RUNNING,
          progress: Math.floor((i / steps.length) * 100),
        }), { EX: 3600 });

        // Execute step based on type
        const stepResult = await this.executeStep(step, inputData, results);
        results[step.id] = stepResult;
      }

      // Update execution as completed
      const executionTime = Date.now() - startTime;
      await this.updateExecutionStatus(executionId, ExecutionStatus.COMPLETED, results);

      // Record usage
      await this.recordUsage(templateId, executionId, executionTime);

    } catch (error) {
      await this.updateExecutionStatus(
        executionId,
        ExecutionStatus.FAILED,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Execute a single pipeline step
   * TODO: Implement actual step execution logic based on step type
   */
  private async executeStep(
    step: any,
    inputData: Record<string, any>,
    previousResults: Record<string, any>
  ): Promise<any> {
    switch (step.step_type) {
      case PipelineStepType.IMAGE_GENERATION:
        return await this.aiService.generateImage({
          prompt: step.config.prompt || inputData.prompt,
          width: step.config.width,
          height: step.config.height,
        });

      case PipelineStepType.IMAGE_ANALYSIS:
        const imageUrl = step.depends_on_step_id
          ? previousResults[step.depends_on_step_id]?.imageUrl
          : inputData.imageUrl;
        
        return await this.aiService.analyzeImage({
          imageUrl,
          prompt: step.config.analysisPrompt || 'Analyze this image',
        });

      case PipelineStepType.VIDEO_GENERATION:
        const inputImageUrl = step.depends_on_step_id
          ? previousResults[step.depends_on_step_id]?.imageUrl
          : inputData.imageUrl;

        return await this.aiService.generateVideo({
          prompt: step.config.prompt || inputData.prompt,
          duration: step.config.duration,
          inputImageUrl,
        });

      default:
        throw new AppError(`Unknown step type: ${step.step_type}`, 400);
    }
  }

  private async updateExecutionStatus(
    executionId: string,
    status: ExecutionStatus,
    results?: Record<string, any>,
    errorMessage?: string
  ): Promise<void> {
    await query(
      `UPDATE pipeline_executions 
       SET status = $1, results = $2, error_message = $3, completed_at = NOW() 
       WHERE id = $4`,
      [status, results ? JSON.stringify(results) : null, errorMessage, executionId]
    );

    // Update cache
    await redis.set(`execution:${executionId}`, JSON.stringify({
      status,
      progress: status === ExecutionStatus.COMPLETED ? 100 : 0,
    }), { EX: 3600 });
  }

  private async recordUsage(
    templateId: string,
    executionId: string,
    executionTimeMs: number
  ): Promise<void> {
    const result = await query(
      'SELECT user_id FROM pipeline_executions WHERE id = $1',
      [executionId]
    );

    if (result.rows.length > 0) {
      await query(
        `INSERT INTO template_usage 
         (id, template_id, user_id, execution_id, credits_used, execution_time_ms) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), templateId, result.rows[0].user_id, executionId, 1, executionTimeMs]
      );
    }
  }

  async getExecutionStatus(executionId: string): Promise<PipelineExecution> {
    // Try cache first
    const cached = await redis.get(`execution:${executionId}`);
    
    const result = await query(
      'SELECT * FROM pipeline_executions WHERE id = $1',
      [executionId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Execution not found', 404);
    }

    return {
      ...result.rows[0],
      input_data: result.rows[0].input_data,
      results: result.rows[0].results,
    };
  }
}
