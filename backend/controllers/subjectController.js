import { Subject } from '../models/Subject.js';

export const subjectController = {
  async getAll(req, res) {
    try {
      const subjects = await Subject.findAll();
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const subject = await Subject.findById(req.params.id);
      if (!subject) return res.status(404).json({ message: 'Materia no encontrada' });
      res.json(subject);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const subject = await Subject.create(req.body);
      res.status(201).json(subject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const subject = await Subject.update(req.params.id, req.body);
      res.json(subject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Subject.delete(req.params.id);
      res.json({ message: 'Materia eliminada' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};