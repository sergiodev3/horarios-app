import React, { useState, useEffect } from 'react';
import type { 
  Schedule, 
  ScheduleFormData 
} from '../types/schedule';
import type { Teacher } from '../types/teacher';
import type { Subject } from '../types/subject';
import { teacherService } from '../services/teacherService';
import { subjectService } from '../services/subjectService';
import { scheduleService } from '../services/scheduleService';
import { logger } from '../services/logger';
import './ScheduleCellModal.css';

interface ScheduleCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleFormData) => Promise<void>;
  schedule?: Schedule | null;
  title: string;
  groupId: number;
  day: string;
  hour: string;
  timeDisplay: string;
}

const ScheduleCellModal: React.FC<ScheduleCellModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
  title,
  groupId,
  day,
  hour,
  timeDisplay
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    group_id: groupId,
    subject_id: 0,
    teacher_id: 0,
    day,
    hour
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherConflict, setTeacherConflict] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (schedule) {
        setFormData({
          group_id: groupId,
          subject_id: schedule.subject_id,
          teacher_id: schedule.teacher_id,
          day,
          hour
        });
      } else {
        setFormData({
          group_id: groupId,
          subject_id: 0,
          teacher_id: 0,
          day,
          hour
        });
      }
      setError('');
      setTeacherConflict('');
    }
  }, [isOpen, schedule, groupId, day, hour]);

  const loadData = async () => {
    try {
      const [teachersData, subjectsData] = await Promise.all([
        teacherService.getAll(),
        subjectService.getAll()
      ]);
      setTeachers(teachersData);
      setSubjects(subjectsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos';
      setError(errorMessage);
      logger.error('Error al cargar datos para modal de horario', error);
    }
  };

  const checkTeacherConflict = async (teacherId: number) => {
    if (!teacherId) {
      setTeacherConflict('');
      return;
    }

    try {
      const hasConflict = await scheduleService.checkTeacherConflict(
        teacherId, 
        day, 
        hour, 
        schedule?.id
      );
      
      if (hasConflict) {
        const teacher = teachers.find(t => t.id === teacherId);
        setTeacherConflict(`⚠️ El maestro ${teacher?.name} ya tiene clase en este horario`);
      } else {
        setTeacherConflict('');
      }
    } catch (error) {
      logger.error('Error al verificar conflicto de maestro', error);
    }
  };

  const handleInputChange = (field: keyof ScheduleFormData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (field === 'teacher_id' && value) {
      checkTeacherConflict(Number(value));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.subject_id) {
      setError('Selecciona una materia');
      return false;
    }
    if (!formData.teacher_id) {
      setError('Selecciona un maestro');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (teacherConflict) {
      setError('No se puede asignar el maestro debido a conflicto de horario');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar horario';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-cell-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="time-info">
            <h3>{day}</h3>
            <p>{timeDisplay}</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {teacherConflict && (
            <div className="warning-message">
              {teacherConflict}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Materia *</label>
              <select
                id="subject"
                value={formData.subject_id}
                onChange={(e) => handleInputChange('subject_id', parseInt(e.target.value))}
                required
              >
                <option value={0}>Seleccionar materia...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teacher">Maestro *</label>
              <select
                id="teacher"
                value={formData.teacher_id}
                onChange={(e) => handleInputChange('teacher_id', parseInt(e.target.value))}
                required
              >
                <option value={0}>Seleccionar maestro...</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.rfc ? `(${teacher.rfc})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
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
                disabled={isLoading || !!teacherConflict}
              >
                {isLoading ? '⏳ Guardando...' : (schedule ? 'Actualizar' : 'Asignar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCellModal;