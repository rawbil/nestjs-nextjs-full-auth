import Register from "@/components/views/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account"
}

export default function RegisterPage() {
  return (
    <Register />
  )
}