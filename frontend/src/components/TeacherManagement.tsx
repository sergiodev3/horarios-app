import React, { useState, useEffect } from 'react';
import type { Teacher, TeacherFormData } from '../types/teacher';
import { teacherService } from '../services/teacherService';
import { logger } from '../services/logger';
import TeacherModal from './TeacherModal';
import ConfirmModal from './ConfirmModal';
import './TeacherManagement.css';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    teacher: Teacher | null;
  }>({ isOpen: false, teacher: null });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const teachersData = await teacherService.getAll();
      setTeachers(teachersData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar profesores';
      setError(errorMessage);
      logger.error('Error al cargar profesores', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async (formData: TeacherFormData) => {
    try {
      if (selectedTeacher) {
        // Actualizar profesor existente
        await teacherService.update(selectedTeacher.id, formData);
      } else {
        // Crear nuevo profesor
        await teacherService.create(formData);
      }
      await loadTeachers(); // Recargar la lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar profesor';
      setError(errorMessage);
      throw error; // Re-lanzar para que el modal pueda manejar el estado
    }
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setConfirmDelete({
      isOpen: true,
      teacher: teacher
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.teacher) return;

    try {
      setIsDeleting(confirmDelete.teacher.id);
      await teacherService.delete(confirmDelete.teacher.id);
      await loadTeachers(); // Recargar la lista
      setConfirmDelete({ isOpen: false, teacher: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar profesor';
      setError(errorMessage);
      logger.error('Error al eliminar profesor', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, teacher: null });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.rfc && teacher.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="teacher-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando profesores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-management">
      <div className="header-section">
        <div className="title-section">
          <h1>Gestión de Profesores</h1>
          <p>Administra la información de los profesores del sistema</p>
        </div>
        <button className="create-button" onClick={handleCreateTeacher}>
          <span className="plus-icon">+</span>
          Nuevo Profesor
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
            placeholder="Buscar por nombre o RFC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="teachers-grid">
        {filteredTeachers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍🏫</div>
            <h3>
              {searchTerm ? 'No se encontraron profesores' : 'No hay profesores registrados'}
            </h3>
            <p>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando un nuevo profesor al sistema'
              }
            </p>
            {!searchTerm && (
              <button className="empty-action-button" onClick={handleCreateTeacher}>
                Agregar primer profesor
              </button>
            )}
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-info">
                <h3 className="teacher-name">{teacher.name}</h3>
                <p className="teacher-rfc">
                  RFC: {teacher.rfc || <span className="no-rfc">No especificado</span>}
                </p>
              </div>
              
              <div className="teacher-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditTeacher(teacher)}
                  title="Editar profesor"
                >
                  ✏️
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTeacher(teacher)}
                  disabled={isDeleting === teacher.id}
                  title="Eliminar profesor"
                >
                  {isDeleting === teacher.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
        title={selectedTeacher ? 'Editar Profesor' : 'Nuevo Profesor'}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Profesor"
        message={`¿Estás seguro de que deseas eliminar al profesor "${confirmDelete.teacher?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting === confirmDelete.teacher?.id}
      />
    </div>
  );
};

export default TeacherManagement;