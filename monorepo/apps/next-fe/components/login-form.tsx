"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {  setToken } from "@/lib/auth";
// import { cookies } from "next/headers";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
 const login = async (username: string, password: string) => {
    const response = await axios.post("http://localhost:3001/api/v1/signin", {
      username: username,
      password: password,
    });
    if (response.status === 200) {
      return response;
    } else return null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(username, password);
    if (!success) {
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } else {
      await setToken(success.data.token);
      router.push("/profile");
    }
    setIsLoading(false);
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 text-sm"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 text-sm"
          />

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="flex items-center my-4">
          <span className="px-4 text-sm font-semibold mx-auto text-gray-500">
            OR
          </span>
        </div>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-blue-900"
        >
          <Facebook className="w-5 h-5" />
          <span>Log in with Facebook</span>
        </Button>

        <div className="mt-4 text-center">
          <Link href="#" className="text-xs text-blue-900">
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="bg-white mt-4 p-6 border rounded-lg shadow-sm text-center">
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
