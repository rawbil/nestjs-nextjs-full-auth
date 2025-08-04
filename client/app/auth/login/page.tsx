import Login from "@/components/views/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login"
}

export default function LoginPage() {
  return (
    <Login />
  )
}