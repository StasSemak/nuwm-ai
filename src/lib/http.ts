import axios from "axios";

export const http = axios.create({
  baseURL: `${import.meta.env.BACKEND_URL}/api/`,
  headers: {
    Authorization: `Bearer ${import.meta.env.AUTH_TOKEN}`,
  },
});
