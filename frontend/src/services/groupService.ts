import type { Group, CreateGroupData, UpdateGroupData } from '../types/group';
import { authService } from './authService';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000/api';

class GroupService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAll(): Promise<Group[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener grupos');
      }

      const groups = await response.json();
      logger.log('Grupos obtenidos', { count: groups.length });
      return groups;
    } catch (error) {
      logger.error('Error al obtener grupos', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Group> {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener grupo');
      }

      const group = await response.json();
      logger.log('Grupo obtenido', { id });
      return group;
    } catch (error) {
      logger.error('Error al obtener grupo', error);
      throw error;
    }
  }

  async create(groupData: CreateGroupData): Promise<Group> {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear grupo');
      }

      const group = await response.json();
      logger.log('Grupo creado', { id: group.id, name: group.name });
      return group;
    } catch (error) {
      logger.error('Error al crear grupo', error);
      throw error;
    }
  }

  async update(id: number, groupData: UpdateGroupData): Promise<Group> {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar grupo');
      }

      const group = await response.json();
      logger.log('Grupo actualizado', { id, name: group.name });
      return group;
    } catch (error) {
      logger.error('Error al actualizar grupo', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar grupo');
      }

      logger.log('Grupo eliminado', { id });
    } catch (error) {
      logger.error('Error al eliminar grupo', error);
      throw error;
    }
  }
}

export const groupService = new GroupService();