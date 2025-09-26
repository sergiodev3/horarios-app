import type { Subject, CreateSubjectData, UpdateSubjectData } from '../types/subject';
import { authService } from './authService';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000/api';

class SubjectService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAll(): Promise<Subject[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener materias');
      }

      const subjects = await response.json();
      logger.log('Materias obtenidas', { count: subjects.length });
      return subjects;
    } catch (error) {
      logger.error('Error al obtener materias', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Subject> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener materia');
      }

      const subject = await response.json();
      logger.log('Materia obtenida', { id });
      return subject;
    } catch (error) {
      logger.error('Error al obtener materia', error);
      throw error;
    }
  }

  async create(subjectData: CreateSubjectData): Promise<Subject> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subjectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear materia');
      }

      const subject = await response.json();
      logger.log('Materia creada', { id: subject.id, name: subject.name });
      return subject;
    } catch (error) {
      logger.error('Error al crear materia', error);
      throw error;
    }
  }

  async update(id: number, subjectData: UpdateSubjectData): Promise<Subject> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subjectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar materia');
      }

      const subject = await response.json();
      logger.log('Materia actualizada', { id, name: subject.name });
      return subject;
    } catch (error) {
      logger.error('Error al actualizar materia', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar materia');
      }

      logger.log('Materia eliminada', { id });
    } catch (error) {
      logger.error('Error al eliminar materia', error);
      throw error;
    }
  }
}

export const subjectService = new SubjectService();