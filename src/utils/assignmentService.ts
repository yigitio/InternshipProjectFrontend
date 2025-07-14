import axios from "axios";

export interface Assignment {
  id?: number;
  internId: number;
  mentorId: number;
  assignmentName: string;
  assignmentDesc?: string;
  dueDate?: string;
  priority?: string;
  assignedAt?: string;
  completedAt?: string;
  status?: string;
}

const BASE_URL = "http://localhost:8080/api/assignments";

export const fetchAssignments = async (): Promise<Assignment[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addAssignment = async (assignment: Assignment): Promise<void> => {
  await axios.post(BASE_URL, assignment);
};

export const updateAssignment = async (
  id: number,
  assignment: Assignment
): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, assignment);
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
