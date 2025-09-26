import React, { useState, useEffect } from 'react';
import type { Subject, SubjectFormData } from '../types/subject';
import './SubjectModal.css';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubjectFormData) => Promise<void>;
  subject?: Subject | null;
  title: string;
}

const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subject,
  title
}) => {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SubjectFormData>>({});

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code
      });
    } else {
      setFormData({
        name: '',
        code: ''
      });
    }
    setErrors({});
  }, [subject, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SubjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'El código debe tener al menos 2 caracteres';
    } else if (formData.code.trim().length > 10) {
      newErrors.code = 'El código no puede tener más de 10 caracteres';
    } else if (!/^[A-Z0-9-_]+$/i.test(formData.code.trim())) {
      newErrors.code = 'El código solo puede contener letras, números, guiones y guiones bajos';
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
        ...formData,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase()
      });
      onClose();
    } catch {
      // El error se maneja en el componente padre
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof SubjectFormData]) {
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

        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la materia *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ej: Matemáticas Avanzadas"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="code">Código de la materia *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={errors.code ? 'error' : ''}
              placeholder="Ej: MAT101"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
            <small className="help-text">
              Código único para identificar la materia (ej: MAT101, ESP201)
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

export default SubjectModal;