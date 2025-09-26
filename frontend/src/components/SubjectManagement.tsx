import React, { useState, useEffect } from 'react';
import type { Subject, SubjectFormData } from '../types/subject';
import { subjectService } from '../services/subjectService';
import { logger } from '../services/logger';
import SubjectModal from './SubjectModal';
import ConfirmModal from './ConfirmModal';
import './SubjectManagement.css';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    subject: Subject | null;
  }>({ isOpen: false, subject: null });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      const subjectsData = await subjectService.getAll();
      setSubjects(subjectsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar materias';
      setError(errorMessage);
      logger.error('Error al cargar materias', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubject = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleSaveSubject = async (formData: SubjectFormData) => {
    try {
      if (selectedSubject) {
        // Actualizar materia existente
        await subjectService.update(selectedSubject.id, formData);
      } else {
        // Crear nueva materia
        await subjectService.create(formData);
      }
      await loadSubjects(); // Recargar la lista
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar materia';
      setError(errorMessage);
      throw error; // Re-lanzar para que el modal pueda manejar el estado
    }
  };

  const handleDeleteSubject = (subject: Subject) => {
    setConfirmDelete({
      isOpen: true,
      subject: subject
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.subject) return;

    try {
      setIsDeleting(confirmDelete.subject.id);
      await subjectService.delete(confirmDelete.subject.id);
      await loadSubjects(); // Recargar la lista
      setConfirmDelete({ isOpen: false, subject: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar materia';
      setError(errorMessage);
      logger.error('Error al eliminar materia', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, subject: null });
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="subject-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando materias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-management">
      <div className="header-section">
        <div className="title-section">
          <h1>Gestión de Materias</h1>
          <p>Administra las materias del sistema educativo</p>
        </div>
        <button className="create-button" onClick={handleCreateSubject}>
          <span className="plus-icon">+</span>
          Nueva Materia
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
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="subjects-grid">
        {filteredSubjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>
              {searchTerm ? 'No se encontraron materias' : 'No hay materias registradas'}
            </h3>
            <p>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando una nueva materia al sistema'
              }
            </p>
            {!searchTerm && (
              <button className="empty-action-button" onClick={handleCreateSubject}>
                Agregar primera materia
              </button>
            )}
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <div key={subject.id} className="subject-card">
              <div className="subject-info">
                <h3 className="subject-name">{subject.name}</h3>
                <p className="subject-code">Código: {subject.code}</p>
              </div>
              
              <div className="subject-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditSubject(subject)}
                  title="Editar materia"
                >
                  ✏️
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSubject(subject)}
                  disabled={isDeleting === subject.id}
                  title="Eliminar materia"
                >
                  {isDeleting === subject.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSubject}
        subject={selectedSubject}
        title={selectedSubject ? 'Editar Materia' : 'Nueva Materia'}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Materia"
        message={`¿Estás seguro de que deseas eliminar la materia "${confirmDelete.subject?.name}" (${confirmDelete.subject?.code})? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting === confirmDelete.subject?.id}
      />
    </div>
  );
};

export default SubjectManagement;