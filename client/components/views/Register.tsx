"use client";

import { FaGithub, FaInstagram } from "react-icons/fa";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useRouter } from "next/navigation";
import { registerSchema } from "@/components/utils/auth-validation";
import { useFormik } from "formik";
import { BsGoogle } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { RegisterMutation } from "../config/mutations/auth.mutations";
import { useState } from "react";
import toast from "react-hot-toast";

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function Register() {
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  //* Register Mutation
  const registerMutation = useMutation({
    mutationFn: RegisterMutation,
    onError: (error: any) => {
      setErrorMsg(error.data.message);
      //toast.error(error.data.message)
      console.log(error.data.message);
    },
    onSuccess: (data) => {
      setErrorMsg('')
      toast.success(data.message);
      redirect('/auth/login');
    },
  });

  const onSubmit = async (data: RegisterData) => {
    const {confirm_password, ...validData} = data;
    const cleanedData = {...validData}
    await registerMutation.mutateAsync(cleanedData);
  };

  const { handleChange, handleBlur, errors, handleSubmit, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      confirm_password: "",
    },
    validationSchema: registerSchema,
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
          <CardTitle>Register your account</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.username && "border-destructive"}`}
                />
                {errors.username && (
                  <span className="text-red-500 text-sm ">
                    {errors.username}
                  </span>
                )}
              </div>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.password && "border-destructive"}`}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm ">
                    {errors.password}
                  </span>
                )}
              </div>
              {/* confirm password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  required
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${
                    errors.confirm_password && "border-destructive"
                  }`}
                />
                {errors.confirm_password && (
                  <span className="text-red-500 text-sm ">
                    {errors.confirm_password}
                  </span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-5">
              Register
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
                    Register with Google
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
                    Register with Github
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
                    Register with Instagram
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
