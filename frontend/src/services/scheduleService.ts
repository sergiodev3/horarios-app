import type { 
  Schedule, 
  CreateScheduleData, 
  UpdateScheduleData 
} from '../types/schedule';
import { authService } from './authService';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000/api';

class ScheduleService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAll(): Promise<Schedule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener horarios');
      }

      const schedules = await response.json();
      logger.log('Horarios obtenidos', { count: schedules.length });
      return schedules;
    } catch (error) {
      logger.error('Error al obtener horarios', error);
      throw error;
    }
  }

  async getByGroupId(groupId: number): Promise<Schedule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules?group_id=${groupId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Si no hay horarios para el grupo, devolver array vacío
          return [];
        }
        throw new Error('Error al obtener horarios del grupo');
      }

      const schedules = await response.json();
      logger.log('Horarios del grupo obtenidos', { 
        groupId, 
        count: schedules.length,
        rawData: schedules 
      });
      return schedules || [];
    } catch (error) {
      logger.error('Error al obtener horarios del grupo', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Schedule> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener horario');
      }

      const schedule = await response.json();
      logger.log('Horario obtenido', { id });
      return schedule;
    } catch (error) {
      logger.error('Error al obtener horario', error);
      throw error;
    }
  }

  async create(data: CreateScheduleData): Promise<Schedule> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error(errorData.message || 'Conflicto de horario: el maestro ya está asignado en esa hora');
        }
        throw new Error(errorData.message || 'Error al crear horario');
      }

      const schedule = await response.json();
      logger.log('Horario creado', { id: schedule.id });
      return schedule;
    } catch (error) {
      logger.error('Error al crear horario', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateScheduleData): Promise<Schedule> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error(errorData.message || 'Conflicto de horario: el maestro ya está asignado en esa hora');
        }
        throw new Error(errorData.message || 'Error al actualizar horario');
      }

      const schedule = await response.json();
      logger.log('Horario actualizado', { id });
      return schedule;
    } catch (error) {
      logger.error('Error al actualizar horario', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar horario');
      }

      logger.log('Horario eliminado', { id });
    } catch (error) {
      logger.error('Error al eliminar horario', error);
      throw error;
    }
  }

  async checkTeacherConflict(teacherId: number, day: string, hour: string, excludeId?: number): Promise<boolean> {
    try {
      const schedules = await this.getAll();
      const conflict = schedules.find(schedule => 
        schedule.teacher_id === teacherId &&
        schedule.day === day &&
        schedule.hour === hour &&
        schedule.id !== excludeId
      );
      
      return !!conflict;
    } catch (error) {
      logger.error('Error al verificar conflicto de maestro', error);
      return false;
    }
  }
}

export const scheduleService = new ScheduleService();