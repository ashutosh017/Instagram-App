"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cookies } from "next/headers";
import { setToken } from "@/lib/auth";

export function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    profilePic: "http://profilepic.com/",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const signup = async (formData: any) => {
    const response = await axios.post("http://localhost:3001/api/v1/signup", {
      ...formData
    });
  if(response.status === 200){
    const signinResponse=await axios.post("http://localhost:3001/api/v1/signin", {
        username: formData.username,
        password: formData.password,
      });
        return signinResponse;
    }else{
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

   

      const success = await signup(formData);
      if (!success) {
        toast({
          title: "Signup failed",
          description: "Please try again.",
          variant: "destructive",
        });

      }else{
        await setToken(success.data.token)
        router.push("/profile");
      }
      setIsLoading(false);

  };

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.length >= 6
    );
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white p-8 border rounded-lg shadow-sm">
        <div className="relative w-[175px] h-[51px] overflow-hidden mx-auto mb-8">
          <Image
            src="https://static.cdninstagram.com/rsrc.php/v4/yB/r/E7m8ZCMOFDS.png"
            alt="Instagram"
            width={175}
            height={255} // The full height or enough to show vertical positioning
            className="absolute top-[-51px] left-0"
          />
        </div>

        <h2 className="text-center font-semibold text-gray-500 text-lg mb-6">
          Sign up to see photos and videos from your friends.
        </h2>

        <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-4 flex items-center justify-center gap-2">
          <Facebook className="w-5 h-5" />
          <span>Log in with Facebook</span>
        </Button>

        <div className="flex items-center my-4 ">
          <span className="px-4 text-sm font-semibold mx-auto text-gray-500">OR</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-10 text-sm"
          />

          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="h-10 text-sm"
          />

          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="h-10 text-sm"
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="h-10 text-sm"
          />

          <p className="text-xs text-center text-gray-500 mb-4">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-blue-900 font-semibold">
              Terms
            </Link>
            ,{" "}
            <Link href="#" className="text-blue-900 font-semibold">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-900 font-semibold">
              Cookies Policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </div>

      <div className="bg-white mt-4 p-6 border rounded-lg shadow-sm text-center">
        <p className="text-sm">
          Have an account?{" "}
          <Link href="/signin" className="text-blue-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
