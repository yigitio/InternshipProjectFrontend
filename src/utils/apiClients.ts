import axios from 'axios';
import { msalInstance } from '@/plugins/msal';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Örnek token ekleyici interceptor
axiosInstance.interceptors.request.use(async config => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const result = await msalInstance.acquireTokenSilent({
      scopes: ['user.read'],
      account: accounts[0],
    });
    config.headers.Authorization = `Bearer ${result.accessToken}`;
  }
  return config;
});

// Eğer elle istek atmak istersen bu hâl hazırda çalışır
export const getInternsWithAuth = async () => {
  const response = await axiosInstance.get('/api/interns');
  return response.data;
};
