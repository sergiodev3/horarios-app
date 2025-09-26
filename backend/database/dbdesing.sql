-- Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' -- 'admin' or 'user'
);

-- Maestros
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Materias
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20)
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  grade INTEGER NOT NULL
);

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id),
  subject_id INTEGER REFERENCES subjects(id),
  teacher_id INTEGER REFERENCES teachers(id),
  day VARCHAR(10), -- 'LUNES', 'MARTES', etc.
  hour VARCHAR(10) -- '07:00', '08:20', etc.
);