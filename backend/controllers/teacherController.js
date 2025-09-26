import { Teacher } from '../models/Teacher.js';

export const teacherController = {
  async getAll(req, res) {
    try {
      const teachers = await Teacher.findAll();
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) return res.status(404).json({ message: 'Maestro no encontrado' });
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const teacher = await Teacher.create(req.body);
      res.status(201).json(teacher);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const teacher = await Teacher.update(req.params.id, req.body);
      res.json(teacher);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Teacher.delete(req.params.id);
      res.json({ message: 'Maestro eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};