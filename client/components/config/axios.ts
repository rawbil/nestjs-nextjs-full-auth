import { redirect } from 'next/navigation';
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

//* Refresh token on 401 errors, otherwise redirect to login page
axiosApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosApi.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(response.data.access_token);
        console.log("New Access Token generated", response.data.access_token);

        // Update the original request's Authorization header
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;

        return axiosApi(originalRequest); //retry original request
      } catch (err) {
        useAuthStore.getState().clearAccessToken(); // clear access token
        window.location.href="/auth/login" //Redirect to login
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
