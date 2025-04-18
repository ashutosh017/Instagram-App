import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const BACKEND_URL = "http://localhost:3000"; // Fixed typo

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("handleAuth called");

    if (
      !usernameRef.current?.value ||
      !passwordRef.current?.value ||
      !emailRef.current?.value
    ) {
      console.log("returning");
      return;
    }

    try {
      if (isSignUp) {
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          email: emailRef.current.value,
          name: nameRef.current?.value,
          profilePic: "https://profile-pic.com",
        });
      }
      const signInRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });
      const token = signInRes.data.token;
      localStorage.setItem("token", token);
      navigate("/feed");
    } catch (error) {
      console.log("some error occured: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <input
              ref={nameRef}
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            ref={usernameRef}
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSignUp && (
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 font-semibold ml-1"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
