import pool from '../database/db.conect.js';

export class Teacher {
  // Métodos CRUD 
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM teachers');
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, rfc }) {
    const { rows } = await pool.query(
      'INSERT INTO teachers (name, rfc) VALUES ($1, $2) RETURNING *',
      [name, rfc]
    );
    return rows[0];
  }

  static async update(id, { name, rfc }) {
    const { rows } = await pool.query(
      'UPDATE teachers SET name = $1, rfc = $2 WHERE id = $3 RETURNING *',
      [name, rfc, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM teachers WHERE id = $1', [id]);
    return true;
  }
}