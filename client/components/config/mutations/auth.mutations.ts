import { useAuthStore } from "@/app/(components)/context/zustand-store";
import axiosApi from "../axios";

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export const RegisterMutation = async (data: RegisterData) => {
  try {
    const response = await axiosApi.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const LoginMutation = async (data: LoginData) => {
  try {
    const response = await axiosApi.post("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const LogoutMutation = async () => {
  try {
    const response = await axiosApi.post(
      "/auth/logout",
      {},
      {
        headers: {
          // Authorization = `Bearer ${accessToken}`
          //Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};
