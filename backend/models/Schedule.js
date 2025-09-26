import pool from '../database/db.conect.js';

export class Schedule {
   static async findAll() {
    const { rows } = await pool.query(`
      SELECT 
        s.*,
        g.name as group_name,
        subj.name as subject_name,
        subj.code as subject_code,
        t.name as teacher_name
      FROM schedules s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN subjects subj ON s.subject_id = subj.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      ORDER BY s.day, s.hour
    `);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(`
      SELECT 
        s.*,
        g.name as group_name,
        subj.name as subject_name,
        subj.code as subject_code,
        t.name as teacher_name
      FROM schedules s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN subjects subj ON s.subject_id = subj.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = $1
    `, [id]);
    return rows[0];
  }

  static async findByGroupId(groupId) {
    const { rows } = await pool.query(`
      SELECT 
        s.*,
        g.name as group_name,
        subj.name as subject_name,
        subj.code as subject_code,
        t.name as teacher_name
      FROM schedules s
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN subjects subj ON s.subject_id = subj.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      WHERE s.group_id = $1
      ORDER BY s.day, s.hour
    `, [groupId]);
    return rows;
  }

  static async create({ group_id, subject_id, teacher_id, day, hour }) {
    // Validación de empalme
    const conflict = await pool.query(
      `SELECT * FROM schedules
       WHERE teacher_id = $1 AND day = $2 AND hour = $3`,
      [teacher_id, day, hour]
    );
    if (conflict.rows.length > 0) {
      throw new Error('Conflicto: el maestro ya está asignado en esa hora.');
    }
    const { rows } = await pool.query(
      `INSERT INTO schedules (group_id, subject_id, teacher_id, day, hour)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [group_id, subject_id, teacher_id, day, hour]
    );
    return rows[0];
  }

  static async update(id, { group_id, subject_id, teacher_id, day, hour }) {
    // Validación de empalme
    const conflict = await pool.query(
      `SELECT * FROM schedules
       WHERE teacher_id = $1 AND day = $2 AND hour = $3 AND id <> $4`,
      [teacher_id, day, hour, id]
    );
    if (conflict.rows.length > 0) {
      throw new Error('Conflicto: el maestro ya está asignado en esa hora.');
    }
    const { rows } = await pool.query(
      `UPDATE schedules
       SET group_id = $1, subject_id = $2, teacher_id = $3, day = $4, hour = $5
       WHERE id = $6 RETURNING *`,
      [group_id, subject_id, teacher_id, day, hour, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
    return true;
  }
}