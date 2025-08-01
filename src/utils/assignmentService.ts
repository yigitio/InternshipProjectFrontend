// src/utils/assignmentService.ts

import apiClient from '@/utils/apiClients';

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
  internName?: string;
}

// 🆕 Paged response tip tanımı
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page
  size: number;
}

// 🆕 Paged filtre parametreleri
interface FetchAssignmentsParams {
  internId: number;
  page: number;
  size: number;
  sort: string;
  status?: string;
}

// ✅ Normal görevleri al (statik liste)
export const fetchAssignments = async (
  internId: number
): Promise<Assignment[]> => {
  if (!internId) {
    console.error('fetchAssignments çağrıldı ancak internId tanımsız.');
    return [];
  }

  const response = await apiClient.get(
    `/api/assignments/${internId}/assignments`
  );
  return response.data;
};

// ✅ 🆕 Sayfalı, filtreli görev listesi al
export const fetchAssignmentsPaged = async (
  params: FetchAssignmentsParams
): Promise<PagedResponse<Assignment>> => {
  const response = await apiClient.get<PagedResponse<Assignment>>(
    '/api/assignments/paged',
    { params }
  );
  return response.data;
};

// ✅ Yeni görev ekle
export const addAssignment = async (assignment: Assignment): Promise<void> => {
  await apiClient.post('/api/assignments', assignment);
};

// ✅ Görev güncelle
export const updateAssignment = async (
  id: number,
  assignmentUpdate: Partial<Assignment>
): Promise<void> => {
  await apiClient.put(`/api/assignments/${id}`, assignmentUpdate);
};

// ✅ Görev sil
export const deleteAssignment = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/assignments/${id}`);
};
