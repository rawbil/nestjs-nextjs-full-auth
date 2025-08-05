import { useAuthStore } from "@/app/(components)/context/zustand-store";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  // don't add headers, let axios automatically detect, to prevent limiting the types of data sent or received
});

//* Add Bearer token globally on every request
axiosApi.interceptors.request.use(
  (config) => {
    // Since we are outside a react file, we call the accessToken differently:
    const accessToken = useAuthStore.getState().accessToken;
    // Add access token to Bearer token authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosApi;
