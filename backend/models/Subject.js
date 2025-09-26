import pool from '../database/db.conect.js';

export class Subject {
    static async findAll() {
    const { rows } = await pool.query('SELECT * FROM subjects');
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM subjects WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, code }) {
    const { rows } = await pool.query(
      'INSERT INTO subjects (name, code) VALUES ($1, $2) RETURNING *',
      [name, code]
    );
    return rows[0];
  }

  static async update(id, { name, code }) {
    const { rows } = await pool.query(
      'UPDATE subjects SET name = $1, code = $2 WHERE id = $3 RETURNING *',
      [name, code, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
    return true;
  }
}