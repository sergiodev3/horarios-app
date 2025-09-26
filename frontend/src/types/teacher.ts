export interface Teacher {
  id: number;
  name: string;
  rfc: string | null;
}

export interface CreateTeacherData {
  name: string;
  rfc?: string;
}

export interface UpdateTeacherData {
  name: string;
  rfc?: string;
}

export interface TeacherFormData {
  name: string;
  rfc: string;
}