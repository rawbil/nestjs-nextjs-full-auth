"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { BsGoogle } from "react-icons/bs";
import { redirect, useRouter } from "next/navigation";
import { loginSchema } from "@/components/utils/auth-validation";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { LoginMutation } from "../config/mutations/auth.mutations";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/(components)/context/zustand-store";

type SubmitData = {
  email: string;
  password: string;
};

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const loginMutation = useMutation({
    mutationFn: LoginMutation,
    onSuccess: (data) => {
      toast.success(data.message);
      setErrorMsg("");
      // redirect('/');
      router.push("/");
      //Add access_token globally using zustand
      setAccessToken(data.access_token);
    },
    onError: (error: any) => {
      setErrorMsg(error.data.messge || "Error Loggin in");
    },
  });

  const onSubmit = async (data: SubmitData) => {
    loginMutation.mutate(data);
  };

  const { handleChange, handleBlur, errors, handleSubmit, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });
  return (
    <div className="flex items-center h-[80vh] relative">
      {errorMsg && (
        <article className="absolute top-0 right-0 left-0 bg-destructive w-1/2 max-md:w-[90%]  mx-auto flex justify-center z-50 rounded-sm p-2">
          {errorMsg}
        </article>
      )}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              onClick={() => router.push("/auth/register")}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
                  required
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.email && "border-destructive"}`}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm ">{errors.email}</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` ${errors.password && "border-destructive"}`}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm ">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-5">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center w-full justify-center gap-[3%] mt-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="">
                    <BsGoogle />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-white text-slate-800 p-1 rounded-sm mb-0.5 text-xs">
                    Login with Google
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <FaGithub />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-white text-slate-800 p-1 rounded-sm mb-0.5 text-xs">
                    Login with Github
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="">
                    <FaInstagram />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-white text-slate-800 p-1 rounded-sm mb-0.5 text-xs">
                    Login with Instagram
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
