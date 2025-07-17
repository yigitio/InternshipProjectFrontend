import axios from 'axios';
import { msalInstance } from '@/plugins/msal';
import { msalApp } from '@/main';
import { loginRequest } from '@/utils/authConfig';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(async config => {
  const account = msalApp.getActiveAccount();
  if (account) {
    const resp = await msalApp.acquireTokenSilent({ ...loginRequest, account });
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${resp.accessToken}`;
  }
  return config;
});

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

export default api;
