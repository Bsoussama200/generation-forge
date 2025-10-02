import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { config } from '../config/env';
import { AppError, UserRole } from '../types';

export class AuthService {
  async register(email: string, password: string) {
    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    // Create user
    await query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)',
      [userId, email, password_hash]
    );

    // Create default user role
    await query(
      'INSERT INTO user_roles (user_id, role) VALUES ($1, $2)',
      [userId, UserRole.USER]
    );

    // Create user profile
    await query(
      'INSERT INTO user_profiles (user_id, subscription_tier, credits_remaining) VALUES ($1, $2, $3)',
      [userId, 'free', 100]
    );

    return this.generateToken(userId, email, [UserRole.USER]);
  }

  async login(email: string, password: string) {
    // Find user
    const result = await query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Get user roles
    const rolesResult = await query(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [user.id]
    );

    const roles = rolesResult.rows.map(r => r.role);

    return this.generateToken(user.id, user.email, roles);
  }

  private generateToken(userId: string, email: string, roles: UserRole[]) {
    const token = jwt.sign(
      { userId, email, roles },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: userId,
        email,
        roles,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}
