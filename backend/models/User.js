import pool from '../database/db.conect.js';
import bcrypt from 'bcryptjs';

export class User {
  static async findAll() {
    const { rows } = await pool.query('SELECT id, username, role FROM users');
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  static async create({ username, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { rows } = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, role',
      [hashedPassword, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}