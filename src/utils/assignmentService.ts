import axios from 'axios';

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
  mentorName?: string;
}

const BASE_URL = 'http://localhost:8080/api/assignments';

export const fetchAssignments = async (
  internId: number
): Promise<Assignment[]> => {
  // 1. Fonksiyon artık bir 'internId' parametresi alıyor.
  if (!internId) {
    // internId yoksa boş bir liste döndürerek hatayı önle
    console.error('fetchAssignments çağrıldı ancak internId tanımsız.');
    return [];
  }

  // 2. API isteği, gelen internId'yi kullanarak doğru adrese yapılıyor.
  // Bu adresin backend'deki AssignmentController'ınızdaki adresle eşleştiğinden emin olun.
  const response = await axios.get(`/api/assignments/${internId}/assignments`);
  return response.data;
};

export const addAssignment = async (assignment: Assignment): Promise<void> => {
  await axios.post(BASE_URL, assignment);
};

export const updateAssignment = async (
  id: number,
  assignmentUpdate: Partial<Assignment>
): Promise<void> => {
  // Backend'e de sadece değişen kısmı gönderiyoruz
  await axios.put(`${BASE_URL}/${id}`, assignmentUpdate);
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
