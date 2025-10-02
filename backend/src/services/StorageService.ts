import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { AppError } from '../types';

export class StorageService {
  private storagePath: string;

  constructor() {
    this.storagePath = config.storage.path;
    this.ensureStorageDirectoryExists();
  }

  private async ensureStorageDirectoryExists() {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
    }
  }

  /**
   * Upload a file to storage
   * TODO: Implement cloud storage integration (S3, GCS, etc.)
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ url: string; fileId: string }> {
    try {
      const fileId = uuidv4();
      const extension = path.extname(file.originalname);
      const filename = `${fileId}${extension}`;
      const userDir = path.join(this.storagePath, userId);

      // Ensure user directory exists
      await fs.mkdir(userDir, { recursive: true });

      const filePath = path.join(userDir, filename);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // TODO: Upload to cloud storage and return cloud URL
      // For now, return local path
      const url = `/storage/${userId}/${filename}`;

      return { url, fileId };
    } catch (error) {
      console.error('File upload error:', error);
      throw new AppError('File upload failed', 500);
    }
  }

  /**
   * Upload base64 image data
   * Useful for AI-generated images
   */
  async uploadBase64Image(
    base64Data: string,
    userId: string,
    extension: string = 'png'
  ): Promise<{ url: string; fileId: string }> {
    try {
      const fileId = uuidv4();
      const filename = `${fileId}.${extension}`;
      const userDir = path.join(this.storagePath, userId);

      await fs.mkdir(userDir, { recursive: true });

      const filePath = path.join(userDir, filename);

      // Remove data URL prefix if present
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');

      await fs.writeFile(filePath, buffer);

      // TODO: Upload to cloud storage
      const url = `/storage/${userId}/${filename}`;

      return { url, fileId };
    } catch (error) {
      console.error('Base64 upload error:', error);
      throw new AppError('Image upload failed', 500);
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(userId: string, fileId: string): Promise<void> {
    try {
      const userDir = path.join(this.storagePath, userId);
      const files = await fs.readdir(userDir);
      
      const fileToDelete = files.find(f => f.startsWith(fileId));
      
      if (fileToDelete) {
        await fs.unlink(path.join(userDir, fileToDelete));
      }

      // TODO: Delete from cloud storage
    } catch (error) {
      console.error('File deletion error:', error);
      throw new AppError('File deletion failed', 500);
    }
  }

  /**
   * Get file URL
   */
  getFileUrl(userId: string, fileId: string, extension: string): string {
    // TODO: Return cloud storage URL
    return `/storage/${userId}/${fileId}.${extension}`;
  }
}
