import axiosInstance from '@/utils/apiClients';
import Mentor from '@/models/mentor';
import { AxiosResponse } from 'axios';

class MentorService {
  // get All Employees
  getAllMentors = (): Promise<Mentor[]> => {
    return axiosInstance
      .get('/mentors')
      .then((response: AxiosResponse<Mentor[]>) => response.data);
  };
  getEmployeeById = (id: any): Promise<Mentor> => {
    return axiosInstance
      .get(`/mentors/${id}`)
      .then((response: AxiosResponse<Mentor>) => response.data);
  };

  edit = (id: any, emp: any): Promise<Mentor> => {
    return axiosInstance
      .put(`/mentors/${id}`, emp)
      .then((response: AxiosResponse<Mentor>) => response.data);
  };
  delete = async (id: any): Promise<Mentor> => {
    return await axiosInstance
      .delete(`/mentors/${id}`)
      .then((response: AxiosResponse<Mentor>) => response.data);
  };
  save = (emp: any): Promise<Mentor> => {
    return axiosInstance
      .post('/mentors', emp)
      .then((response: AxiosResponse<Mentor>) => response.data);
  };
}

export default new MentorService();
