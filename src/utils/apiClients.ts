import axios, { AxiosInstance } from "axios";

const API_URL = "localhost:8080/api/mentors/api/greeting";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
