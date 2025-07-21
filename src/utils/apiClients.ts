import axios from 'axios';
import { msalApp } from '@/main';
import { loginRequest } from '@/utils/authConfig';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // <<< BUNU değiştirme: backend’in URL’si
});

api.interceptors.request.use(async config => {
  const account = msalApp.getActiveAccount();
  if (account) {
    const resp = await msalApp.acquireTokenSilent({ account, ...loginRequest });
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${resp.accessToken}`;
  }
  return config;
});
export const axiosInstance = api;

export default api;
