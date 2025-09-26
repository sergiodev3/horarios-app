export interface Group {
  id: number;
  name: string;
  grade: string;
}

export interface CreateGroupData {
  name: string;
  grade: string;
}

export interface UpdateGroupData {
  name: string;
  grade: string;
}

export interface GroupFormData {
  name: string;
  grade: string;
}