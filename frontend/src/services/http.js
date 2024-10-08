import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000,
  timeoutErrorMessage: "Server timeout",
  withCredentials: true,
});
