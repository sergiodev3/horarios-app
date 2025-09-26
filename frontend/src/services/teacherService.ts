import type { Teacher, CreateTeacherData, UpdateTeacherData } from '../types/teacher';
import { authService } from './authService';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000/api';

class TeacherService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAll(): Promise<Teacher[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener profesores');
      }

      const teachers = await response.json();
      logger.log('Profesores obtenidos', { count: teachers.length });
      return teachers;
    } catch (error) {
      logger.error('Error al obtener profesores', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Teacher> {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener profesor');
      }

      const teacher = await response.json();
      logger.log('Profesor obtenido', { id });
      return teacher;
    } catch (error) {
      logger.error('Error al obtener profesor', error);
      throw error;
    }
  }

  async create(teacherData: CreateTeacherData): Promise<Teacher> {
    try {
      // Enviar RFC como null si está vacío
      const dataToSend = {
        ...teacherData,
        rfc: teacherData.rfc && teacherData.rfc.trim() ? teacherData.rfc : null
      };
      
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear profesor');
      }

      const teacher = await response.json();
      logger.log('Profesor creado', { id: teacher.id, name: teacher.name });
      return teacher;
    } catch (error) {
      logger.error('Error al crear profesor', error);
      throw error;
    }
  }

  async update(id: number, teacherData: UpdateTeacherData): Promise<Teacher> {
    try {
      // Enviar RFC como null si está vacío
      const dataToSend = {
        ...teacherData,
        rfc: teacherData.rfc && teacherData.rfc.trim() ? teacherData.rfc : null
      };
      
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar profesor');
      }

      const teacher = await response.json();
      logger.log('Profesor actualizado', { id, name: teacher.name });
      return teacher;
    } catch (error) {
      logger.error('Error al actualizar profesor', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar profesor');
      }

      logger.log('Profesor eliminado', { id });
    } catch (error) {
      logger.error('Error al eliminar profesor', error);
      throw error;
    }
  }
}

export const teacherService = new TeacherService();