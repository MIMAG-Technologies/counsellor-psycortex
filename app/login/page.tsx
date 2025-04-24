/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();

  // Handle login with email and password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Invalid credentials or user not found");
    }
  };

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Password reset email sent! Please check your inbox or spam folder."
      );
      setIsResettingPassword(false);
    } catch (error: any) {
      toast.error("Error sending password reset email: " + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Section */}
      <div className="hidden md:flex w-1/3 bg-gradient-to-br from-[#4338ca] via-[#5647d2] to-[#6f2a86] items-center justify-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute transform -rotate-45 bg-white/10 w-96 h-96 -left-48 -top-48 rounded-full"></div>
          <div className="absolute transform rotate-45 bg-white/10 w-96 h-96 -right-48 -bottom-48 rounded-full"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white px-12 z-10"
        >
          <motion.img
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        src="https://psycortex.in/assets/Images/thebraintakeLogo.png"
        alt="Psycortex Logo"
        className="h-20 mx-auto mb-8 drop-shadow-xl hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
        Welcome Back
          </h1>
          <p className="text-lg text-gray-100 mt-4 leading-relaxed font-light">
        Login to manage and support your clients with ease and professionalism.
          </p>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-2/3 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-[#4338ca] text-center mb-6">
            Counselor Login
          </h2>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338ca] transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338ca] transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#4338ca] hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#4338ca] text-white py-3 rounded-lg font-semibold hover:bg-[#6f2a86] transition-all"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
