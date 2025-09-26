import React, { useState, useEffect } from 'react';
import type { Teacher, TeacherFormData } from '../types/teacher';
import './TeacherModal.css';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeacherFormData) => Promise<void>;
  teacher?: Teacher | null;
  title: string;
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacher,
  title
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    rfc: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        rfc: teacher.rfc || ''
      });
    } else {
      setFormData({
        name: '',
        rfc: ''
      });
    }
    setErrors({});
  }, [teacher, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // RFC es opcional, pero si se proporciona debe ser válido
    if (formData.rfc.trim() && !/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(formData.rfc.toUpperCase())) {
      newErrors.rfc = 'El RFC no tiene un formato válido';
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
        rfc: formData.rfc.trim() ? formData.rfc.toUpperCase() : '' // Normalizar RFC a mayúsculas o vacío
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
    if (errors[name as keyof TeacherFormData]) {
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

        <form onSubmit={handleSubmit} className="teacher-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ingresa el nombre completo del profesor"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rfc">RFC (opcional)</label>
            <input
              type="text"
              id="rfc"
              name="rfc"
              value={formData.rfc}
              onChange={handleInputChange}
              className={errors.rfc ? 'error' : ''}
              placeholder="ABCD123456EF7 (dejar vacío si no se conoce)"
              maxLength={13}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.rfc && <span className="error-message">{errors.rfc}</span>}
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

export default TeacherModal;