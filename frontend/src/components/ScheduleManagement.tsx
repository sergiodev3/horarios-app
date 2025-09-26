import React, { useState, useEffect, useCallback } from 'react';
import type { 
  Schedule, 
  ScheduleFormData, 
  ScheduleCell, 
  ShiftType, 
  TimeSlot 
} from '../types/schedule';
import type { Group } from '../types/group';
import { 
  MORNING_SCHEDULE, 
  AFTERNOON_SCHEDULE, 
  DAYS 
} from '../types/schedule';
import { scheduleService } from '../services/scheduleService';
import { groupService } from '../services/groupService';
import { pdfService } from '../services/pdfService';
import { logger } from '../services/logger';
import ScheduleCellModal from './ScheduleCellModal';
import ConfirmModal from './ConfirmModal';
import './ScheduleManagement.css';

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedShift, setSelectedShift] = useState<ShiftType>('morning');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Modal states
  const [isCellModalOpen, setIsCellModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    schedule?: Schedule;
    day: string;
    hour: string;
    timeDisplay: string;
  } | null>(null);
  
  // Confirm delete modal
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    schedule: Schedule | null;
  }>({ isOpen: false, schedule: null });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const groupsData = await groupService.getAll();
      setGroups(groupsData || []);
      
      if (groupsData && groupsData.length > 0) {
        setSelectedGroup(groupsData[0].id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar grupos';
      setError(errorMessage);
      logger.error('Error al cargar grupos', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSchedules = useCallback(async () => {
    if (!selectedGroup) return;
    
    try {
      setError('');
      const schedulesData = await scheduleService.getByGroupId(selectedGroup);
      logger.log('Actualizando horarios para grupo', { 
        groupId: selectedGroup, 
        count: schedulesData?.length || 0,
        data: schedulesData
      });
      setSchedules(schedulesData || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar horarios';
      setError(errorMessage);
      logger.error('Error al cargar horarios', error);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      loadSchedules();
    } else {
      setSchedules([]); // Limpiar horarios cuando no hay grupo seleccionado
    }
  }, [selectedGroup, loadSchedules]);

  const getCurrentSchedule = (): TimeSlot[] => {
    return selectedShift === 'morning' ? MORNING_SCHEDULE : AFTERNOON_SCHEDULE;
  };

  const getScheduleCell = (day: string, hour: string): ScheduleCell => {
    const schedule = schedules.find(s => s.day === day && s.hour === hour);
    
    if (schedule) {
      return {
        id: schedule.id,
        subject_id: schedule.subject_id,
        teacher_id: schedule.teacher_id,
        subject_name: schedule.subject_name,
        subject_code: schedule.subject_code,
        teacher_name: schedule.teacher_name,
        isEmpty: false
      };
    }
    
    return { isEmpty: true };
  };

  // Log para depuración - se ejecuta en cada render
  React.useEffect(() => {
    logger.log('Estado actual del componente', {
      selectedGroup,
      schedulesCount: schedules.length,
      schedules: schedules.map(s => ({ day: s.day, hour: s.hour, subject: s.subject_code }))
    });
  }, [selectedGroup, schedules]);

  const isBreakTime = (timeSlot: TimeSlot): boolean => {
    return (selectedShift === 'morning' && timeSlot.start === '09:40') ||
           (selectedShift === 'afternoon' && timeSlot.start === '15:40');
  };

  const handleCellClick = (day: string, hour: string, timeDisplay: string) => {
    if (isBreakTime({ start: hour, end: '', display: timeDisplay })) return;
    
    const schedule = schedules.find(s => s.day === day && s.hour === hour);
    setSelectedCell({ schedule, day, hour, timeDisplay });
    setIsCellModalOpen(true);
  };

  const handleSaveSchedule = async (formData: ScheduleFormData) => {
    if (selectedCell?.schedule) {
      // Actualizar horario existente
      await scheduleService.update(selectedCell.schedule.id, formData);
    } else {
      // Crear nuevo horario
      await scheduleService.create(formData);
    }
    await loadSchedules(); // Recargar horarios
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    setConfirmDelete({
      isOpen: true,
      schedule: schedule
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.schedule) return;

    try {
      setIsDeleting(confirmDelete.schedule.id);
      await scheduleService.delete(confirmDelete.schedule.id);
      await loadSchedules(); // Recargar horarios
      setConfirmDelete({ isOpen: false, schedule: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar horario';
      setError(errorMessage);
      logger.error('Error al eliminar horario', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, schedule: null });
  };

  const handleGroupChange = (groupId: number) => {
    logger.log('Cambiando grupo seleccionado', { from: selectedGroup, to: groupId });
    setSelectedGroup(groupId);
  };

  const handlePrintPDF = async () => {
    if (!selectedGroup) {
      setError('Selecciona un grupo para imprimir');
      return;
    }

    const group = groups.find(g => g.id === selectedGroup);
    if (!group) {
      setError('Grupo no encontrado');
      return;
    }

    try {
      setError(''); // Limpiar errores previos
      await pdfService.generateSchedulePDF(group, schedules, selectedShift);
      logger.log('PDF generado exitosamente', { groupId: selectedGroup, shift: selectedShift });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar PDF';
      setError(errorMessage);
      logger.error('Error al generar PDF', error);
    }
  };



  if (isLoading) {
    return (
      <div className="schedule-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-management">
      <div className="header-section">
        <div className="title-section">
          <h1>Gestión de Horarios</h1>
          <p>Crea y administra los horarios de clases de cada grupo</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="error-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="group-selector">
        <h3>Seleccionar Grupo</h3>
        <select
          className="group-select"
          value={selectedGroup}
          onChange={(e) => handleGroupChange(parseInt(e.target.value))}
        >
          <option value={0}>Seleccionar grupo...</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} - Grado {group.grade}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup > 0 && (
        <>
          <div className="controls-section">
            <div className="shift-selector">
              <button
                className={`shift-button ${selectedShift === 'morning' ? 'active' : ''}`}
                onClick={() => setSelectedShift('morning')}
              >
                🌅 Turno Matutino
              </button>
              <button
                className={`shift-button ${selectedShift === 'afternoon' ? 'active' : ''}`}
                onClick={() => setSelectedShift('afternoon')}
              >
                🌇 Turno Vespertino
              </button>
            </div>
            
            <div className="actions-section">
              <button
                className="print-button"
                onClick={handlePrintPDF}
                title="Descargar horario en PDF"
              >
                📄 Imprimir PDF
              </button>
            </div>
          </div>

          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>HORA</th>
                  {DAYS.map(day => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getCurrentSchedule().map((timeSlot, index) => {
                  const isBreak = isBreakTime(timeSlot);
                  
                  if (isBreak) {
                    return (
                      <tr key={`break-${index}`}>
                        <td className="time-slot">{timeSlot.display}</td>
                        <td colSpan={5} className="schedule-cell break-time">
                          DESCANSO
                        </td>
                      </tr>
                    );
                  }
                  
                  return (
                    <tr key={timeSlot.start}>
                      <td className="time-slot">{timeSlot.display}</td>
                      {DAYS.map(day => {
                        const cell = getScheduleCell(day, timeSlot.start);
                        return (
                          <td key={`${day}-${timeSlot.start}`}>
                            <div
                              className={`schedule-cell ${cell.isEmpty ? '' : 'filled'}`}
                              onClick={() => handleCellClick(day, timeSlot.start, timeSlot.display)}
                            >
                              {cell.isEmpty ? (
                                <div className="empty-cell">
                                  Click para asignar
                                </div>
                              ) : (
                                <div className="cell-content">
                                  <div className="subject-info">
                                    {cell.subject_code}
                                  </div>
                                  <div className="teacher-info">
                                    {cell.teacher_name}
                                  </div>
                                  <div className="cell-actions">
                                    <button
                                      className="cell-action-button delete"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const schedule = schedules.find(s => 
                                          s.day === day && s.hour === timeSlot.start
                                        );
                                        if (schedule) {
                                          handleDeleteSchedule(schedule);
                                        }
                                      }}
                                      title="Eliminar clase"
                                    >
                                      {isDeleting === cell.id ? '⏳' : '🗑️'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="legend">
            <h4>Leyenda</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color empty"></div>
                <span>Hora libre</span>
              </div>
              <div className="legend-item">
                <div className="legend-color filled"></div>
                <span>Clase asignada</span>
              </div>
              <div className="legend-item">
                <div className="legend-color break"></div>
                <span>Descanso</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedGroup && groups.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No hay grupos disponibles</h3>
          <p>Primero debes crear grupos para poder gestionar sus horarios</p>
        </div>
      )}

      {selectedGroup === 0 && groups.length > 0 && (
        <div className="empty-state">
          <div className="empty-icon">👆</div>
          <h3>Selecciona un grupo</h3>
          <p>Elige el grupo para el cual deseas crear o editar el horario</p>
        </div>
      )}

      <ScheduleCellModal
        isOpen={isCellModalOpen}
        onClose={() => {
          setIsCellModalOpen(false);
          setSelectedCell(null);
        }}
        onSave={handleSaveSchedule}
        schedule={selectedCell?.schedule}
        title={selectedCell?.schedule ? 'Editar Clase' : 'Nueva Clase'}
        groupId={selectedGroup}
        day={selectedCell?.day || ''}
        hour={selectedCell?.hour || ''}
        timeDisplay={selectedCell?.timeDisplay || ''}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Clase"
        message={`¿Estás seguro de que deseas eliminar la clase de ${confirmDelete.schedule?.subject_name} con ${confirmDelete.schedule?.teacher_name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting === confirmDelete.schedule?.id}
      />
    </div>
  );
};

export default ScheduleManagement;