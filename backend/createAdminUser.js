import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Configura la conexión, o usa tu .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si no tienes DATABASE_URL en tu .env, usa estos campos:
  // host: 'localhost',
  // port: 5432,
  // user: 'tu_usuario',
  // password: 'tu_password',
  // database: 'horarios-db'
});

async function createAdminUser() {
  const username = 'admin';
  const password = 'admin123'; // Cambia la contraseña si quieres
  const role = 'admin';

  // Hashea la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Verifica si ya existe un usuario admin con ese username
  const exists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (exists.rows.length > 0) {
    console.log('El usuario admin ya existe.');
    await pool.end();
    return;
  }

  // Inserta el usuario admin
  await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
    [username, hashedPassword, role]
  );

  console.log(`Usuario administrador creado:
    username: ${username}
    password: ${password}
    role: ${role}
  `);

  await pool.end();
}

createAdminUser().catch(err => {
  console.error('Error creando usuario admin:', err);
  process.exit(1);
});