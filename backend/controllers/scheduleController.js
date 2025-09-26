import { Schedule } from '../models/Schedule.js';

export const scheduleController = {
  async getAll(req, res) {
    try {
      const { group_id } = req.query;
      
      if (group_id) {
        const schedules = await Schedule.findByGroupId(parseInt(group_id));
        res.json(schedules);
      } else {
        const schedules = await Schedule.findAll();
        res.json(schedules);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const schedule = await Schedule.findById(req.params.id);
      if (!schedule) return res.status(404).json({ message: 'Horario no encontrado' });
      res.json(schedule);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const schedule = await Schedule.create(req.body);
      res.status(201).json(schedule);
    } catch (err) {
      // Si es conflicto de maestro, status 409
      if (err.message.includes('Conflicto')) {
        res.status(409).json({ message: err.message });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  },

  async update(req, res) {
    try {
      const schedule = await Schedule.update(req.params.id, req.body);
      res.json(schedule);
    } catch (err) {
      // Si es conflicto de maestro, status 409
      if (err.message.includes('Conflicto')) {
        res.status(409).json({ message: err.message });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  },

  async delete(req, res) {
    try {
      await Schedule.delete(req.params.id);
      res.json({ message: 'Horario eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};