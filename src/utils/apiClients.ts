import axios from 'axios';
import { msalApp } from '@/main';
import { loginRequest } from '@/utils/authConfig';

const baseURL =
  process.env.VUE_APP_BASE_URL === 'production'
    ? 'http://ec2-13-60-18-136.eu-north-1.compute.amazonaws.com:8080/api'
    : 'http://localhost:8080/api';
const api = axios.create({ baseURL });

api.interceptors.request.use(async config => {
  const account = msalApp.getActiveAccount();
  if (account) {
    const resp = await msalApp.acquireTokenSilent({ account, ...loginRequest });
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${resp.accessToken}`;
  }
  return config;
});

export default api;
export const axiosInstance = api;
