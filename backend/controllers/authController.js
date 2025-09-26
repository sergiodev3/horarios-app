import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

export const authController = {
  // Registro sólo permitido por admin (por tu flujo)
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      const existing = await User.findByUsername(username);
      if (existing) {
        return res.status(400).json({ message: 'El usuario ya existe.' });
      }
      const user = await User.create({ username, password, role });
      res.status(201).json({ user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
      }
      const valid = await User.comparePassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
      }
      const payload = { id: user.id, username: user.username, role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: payload });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};