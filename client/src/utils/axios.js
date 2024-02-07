import axios from "axios";

export const makeRequest = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/`,
  withCredentials: true,
});
