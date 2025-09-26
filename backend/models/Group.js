import pool from '../database/db.conect.js';

export class Group {
    static async findAll() {
    const { rows } = await pool.query('SELECT * FROM groups');
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, grade }) {
    const { rows } = await pool.query(
      'INSERT INTO groups (name, grade) VALUES ($1, $2) RETURNING *',
      [name, grade]
    );
    return rows[0];
  }

  static async update(id, { name, grade }) {
    const { rows } = await pool.query(
      'UPDATE groups SET name = $1, grade = $2 WHERE id = $3 RETURNING *',
      [name, grade, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM groups WHERE id = $1', [id]);
    return true;
  }
}