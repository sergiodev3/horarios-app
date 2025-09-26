export interface Schedule {
  id: number;
  group_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  hour: string;
  group_name?: string;
  subject_name?: string;
  subject_code?: string;
  teacher_name?: string;
}

export interface CreateScheduleData {
  group_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  hour: string;
}

export interface UpdateScheduleData {
  group_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  hour: string;
}

export interface ScheduleFormData {
  group_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  hour: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  display: string;
}

export interface ScheduleCell {
  id?: number;
  subject_id?: number;
  teacher_id?: number;
  subject_name?: string;
  subject_code?: string;
  teacher_name?: string;
  isEmpty: boolean;
}

// Horarios predefinidos según las imágenes
export const MORNING_SCHEDULE: TimeSlot[] = [
  { start: '07:00', end: '07:40', display: '7:00 – 7:40' },
  { start: '07:40', end: '08:20', display: '7:40 – 8:20' },
  { start: '08:20', end: '09:00', display: '8:20 – 9:00' },
  { start: '09:00', end: '09:40', display: '9:00 – 9:40' },
  // Descanso 9:40 - 10:00
  { start: '10:00', end: '10:40', display: '10:00 – 10:40' },
  { start: '10:40', end: '11:20', display: '10:40 – 11:20' },
  { start: '11:20', end: '12:00', display: '11:20 – 12:00' },
  { start: '12:00', end: '12:40', display: '12:00 – 12:40' }
];

export const AFTERNOON_SCHEDULE: TimeSlot[] = [
  { start: '13:00', end: '13:40', display: '1:00 – 1:40' },
  { start: '13:40', end: '14:20', display: '1:40 – 2:20' },
  { start: '14:20', end: '15:00', display: '2:20 – 3:00' },
  { start: '15:00', end: '15:40', display: '3:00 – 3:40' },
  // Descanso 15:40 - 16:00
  { start: '16:00', end: '16:40', display: '4:00 – 4:40' },
  { start: '16:40', end: '17:20', display: '4:40 – 5:20' },
  { start: '17:20', end: '18:00', display: '5:20 – 6:00' },
  { start: '18:00', end: '18:40', display: '6:00 – 6:40' }
];

export const DAYS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

export type ShiftType = 'morning' | 'afternoon';