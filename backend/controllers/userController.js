import { User } from '../models/User.js';

export const userController = {
  async getAll(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const user = await User.updatePassword(id, password);
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await User.delete(req.params.id);
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};