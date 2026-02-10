export interface ResourceState {
  projector: boolean;
  ac: boolean;
  light: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: "Present" | "Absent" | "Late";
  arrivalTime?: string;
}

export interface AttendanceRecord {
  date: string;
  count: number;
  total: number;
}

export interface Room {
  id: string;
  name: string;
  status: "Active" | "Inactive" | "Anomaly";
  studentsCount: number;
  totalCapacity: number;
  resources: ResourceState;
  alert?: string;
  history: AttendanceRecord[];
  currentStudents: Student[];
}
