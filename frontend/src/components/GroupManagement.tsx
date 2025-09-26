import React, { useState, useEffect } from 'react';
import type { Group, GroupFormData } from '../types/group';
import { groupService } from '../services/groupService';
import { logger } from '../services/logger';
import GroupModal from './GroupModal';
import ConfirmModal from './ConfirmModal';
import './GroupManagement.css';

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    group: Group | null;
  }>({ isOpen: false, group: null });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      setError('');
      const groupsData = await groupService.getAll();
      logger.log('Grupos cargados:', groupsData);
      setGroups(groupsData || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar grupos';
      setError(errorMessage);
      logger.error('Error al cargar grupos', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleSaveGroup = async (formData: GroupFormData) => {
    try {
      if (selectedGroup) {
        // Actualizar grupo existente
        await groupService.update(selectedGroup.id, formData);
      } else {
        // Crear nuevo grupo
        await groupService.create(formData);
      }
      await loadGroups(); // Recargar la lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar grupo';
      setError(errorMessage);
      throw error; // Re-lanzar para que el modal pueda manejar el estado
    }
  };

  const handleDeleteGroup = (group: Group) => {
    setConfirmDelete({
      isOpen: true,
      group: group
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.group) return;

    try {
      setIsDeleting(confirmDelete.group.id);
      await groupService.delete(confirmDelete.group.id);
      await loadGroups(); // Recargar la lista
      setConfirmDelete({ isOpen: false, group: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar grupo';
      setError(errorMessage);
      logger.error('Error al eliminar grupo', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, group: null });
  };

  const filteredGroups = groups.filter(group => {
    if (!group || !group.name || !group.grade) return false;
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true; // Si no hay término de búsqueda, mostrar todos
    
    const nameMatch = group.name.toLowerCase().includes(searchLower);
    const gradeMatch = String(group.grade).toLowerCase().includes(searchLower);
    
    return nameMatch || gradeMatch;
  });

  // Agrupar por grado para mejor organización
  const groupsByGrade = filteredGroups.reduce((acc, group) => {
    if (!group || !group.grade) return acc;
    
    const grade = String(group.grade).trim();
    if (!grade) return acc;
    
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(group);
    return acc;
  }, {} as Record<string, Group[]>);

  if (isLoading) {
    return (
      <div className="group-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group-management">
      <div className="header-section">
        <div className="title-section">
          <h1>Gestión de Grupos</h1>
          <p>Administra los grupos y secciones del sistema educativo</p>
        </div>
        <button className="create-button" onClick={handleCreateGroup}>
          <span className="plus-icon">+</span>
          Nuevo Grupo
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="error-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o grado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="groups-section">
        {filteredGroups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>
              {searchTerm ? 'No se encontraron grupos' : 'No hay grupos registrados'}
            </h3>
            <p>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando un nuevo grupo al sistema'
              }
            </p>
            {!searchTerm && (
              <button className="empty-action-button" onClick={handleCreateGroup}>
                Agregar primer grupo
              </button>
            )}
          </div>
        ) : (
          Object.keys(groupsByGrade)
            .filter(grade => grade && groupsByGrade[grade] && groupsByGrade[grade].length > 0)
            .sort()
            .map(grade => (
              <div key={grade} className="grade-section">
                <h2 className="grade-title">Grado {grade}</h2>
                <div className="groups-grid">
                  {groupsByGrade[grade]
                    .filter(group => group && group.id && group.name)
                    .map((group) => (
                      <div key={group.id} className="group-card">
                        <div className="group-info">
                          <h3 className="group-name">{group.name}</h3>
                          <p className="group-grade">Grado {group.grade}</p>
                        </div>
                        
                        <div className="group-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEditGroup(group)}
                            title="Editar grupo"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteGroup(group)}
                            disabled={isDeleting === group.id}
                            title="Eliminar grupo"
                          >
                            {isDeleting === group.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGroup}
        group={selectedGroup}
        title={selectedGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Grupo"
        message={`¿Estás seguro de que deseas eliminar el grupo "${confirmDelete.group?.name}" del grado ${confirmDelete.group?.grade}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting === confirmDelete.group?.id}
      />
    </div>
  );
};

export default GroupManagement;