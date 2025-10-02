import { v4 as uuidv4 } from 'uuid';
import { query, getClient } from '../config/database';
import { Template, AppError } from '../types';

export class TemplateService {
  async createTemplate(
    userId: string,
    data: Partial<Template>
  ): Promise<Template> {
    const id = uuidv4();
    const result = await query(
      `INSERT INTO templates 
       (id, user_id, name, description, category, is_public, thumbnail_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        id,
        userId,
        data.name,
        data.description || null,
        data.category || null,
        data.is_public || false,
        data.thumbnail_url || null,
      ]
    );

    return result.rows[0];
  }

  async getTemplate(templateId: string, userId?: string): Promise<Template> {
    const result = await query(
      `SELECT * FROM templates WHERE id = $1 AND (is_public = true OR user_id = $2)`,
      [templateId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Template not found', 404);
    }

    return result.rows[0];
  }

  async listTemplates(filters: {
    userId?: string;
    category?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ templates: Template[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      whereClause += ` AND user_id = $${paramIndex}`;
      params.push(filters.userId);
      paramIndex++;
    }

    if (filters.category) {
      whereClause += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.isPublic !== undefined) {
      whereClause += ` AND is_public = $${paramIndex}`;
      params.push(filters.isPublic);
      paramIndex++;
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const countResult = await query(
      `SELECT COUNT(*) FROM templates ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT * FROM templates ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      templates: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  async updateTemplate(
    templateId: string,
    userId: string,
    data: Partial<Template>
  ): Promise<Template> {
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

    if (data.category !== undefined) {
      updateFields.push(`category = $${paramIndex}`);
      params.push(data.category);
      paramIndex++;
    }

    if (data.is_public !== undefined) {
      updateFields.push(`is_public = $${paramIndex}`);
      params.push(data.is_public);
      paramIndex++;
    }

    if (data.thumbnail_url !== undefined) {
      updateFields.push(`thumbnail_url = $${paramIndex}`);
      params.push(data.thumbnail_url);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    updateFields.push(`updated_at = NOW()`);

    const result = await query(
      `UPDATE templates 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} 
       RETURNING *`,
      [...params, templateId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Template not found or unauthorized', 404);
    }

    return result.rows[0];
  }

  async deleteTemplate(templateId: string, userId: string): Promise<void> {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Delete associated data
      await client.query('DELETE FROM pipelines WHERE template_id = $1', [
        templateId,
      ]);
      await client.query('DELETE FROM global_inputs WHERE template_id = $1', [
        templateId,
      ]);
      await client.query('DELETE FROM template_usage WHERE template_id = $1', [
        templateId,
      ]);
      await client.query('DELETE FROM template_ratings WHERE template_id = $1', [
        templateId,
      ]);

      // Delete template
      const result = await client.query(
        'DELETE FROM templates WHERE id = $1 AND user_id = $2',
        [templateId, userId]
      );

      if (result.rowCount === 0) {
        throw new AppError('Template not found or unauthorized', 404);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async incrementUsageCount(templateId: string): Promise<void> {
    await query(
      'UPDATE templates SET usage_count = usage_count + 1 WHERE id = $1',
      [templateId]
    );
  }
}
