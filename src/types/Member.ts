export interface Member {
  id: string;
  name: string;
  position?: string;
  departmentId: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  salary?: number;
  photoUrl?: string;
  birthday?: string;
  customFields?: { [key: string]: string };
}
