export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface CreateSubjectData {
  name: string;
  code: string;
}

export interface UpdateSubjectData {
  name: string;
  code: string;
}

export interface SubjectFormData {
  name: string;
  code: string;
}