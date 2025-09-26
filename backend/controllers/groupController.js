import { Group } from '../models/Group.js';

export const groupController = {
  async getAll(req, res) {
    try {
      const groups = await Group.findAll();
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });
      res.json(group);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const group = await Group.create(req.body);
      res.status(201).json(group);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const group = await Group.update(req.params.id, req.body);
      res.json(group);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Group.delete(req.params.id);
      res.json({ message: 'Grupo eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};