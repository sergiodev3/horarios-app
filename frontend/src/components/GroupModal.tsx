import React, { useState, useEffect } from 'react';
import type { Group, GroupFormData } from '../types/group';
import './GroupModal.css';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GroupFormData) => Promise<void>;
  group?: Group | null;
  title: string;
}

const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group,
  title
}) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    grade: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<GroupFormData>>({});

  // Lista de grados comunes
  const gradeOptions = [
    '1', '2', '3'
  ];

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        grade: group.grade
      });
    } else {
      setFormData({
        name: '',
        grade: ''
      });
    }
    setErrors({});
  }, [group, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<GroupFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del grupo es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'El nombre no puede tener más de 50 caracteres';
    }

    // Convertir grade a string para validar
    const gradeString = String(formData.grade);
    if (!gradeString || gradeString.trim() === '') {
      newErrors.grade = 'El grado es requerido';
    } else if (gradeString.trim().length < 1) {
      newErrors.grade = 'El grado debe tener al menos 1 caracter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave({
        name: formData.name.trim(),
        grade: String(formData.grade).trim()
      });
      onClose();
    } catch {
      // El error se maneja en el componente padre
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof GroupFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="group-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del grupo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ej: 1A, 2B, 3C etc."
              maxLength={50}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grado *</label>
            <div className="grade-input-container">
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={errors.grade ? 'error' : ''}
              >
                <option value="">Selecciona un grado</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              
              {formData.grade === 'custom' && (
                <input
                  type="text"
                  name="grade"
                  value=""
                  onChange={handleInputChange}
                  className={errors.grade ? 'error' : ''}
                  placeholder="Escribe el grado personalizado"
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>
            {errors.grade && <span className="error-message">{errors.grade}</span>}
            <small className="help-text">
              Selecciona el grado académico del grupo
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;