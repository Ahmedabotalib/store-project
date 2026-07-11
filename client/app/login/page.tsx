"use client";

import { useState } from "react";

import api from "@/services/api";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    email: "",
    password: "",

  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      // SAVE TOKEN

      localStorage.setItem(
        "token",
        response.data.token
      );
localStorage.setItem(
  "role",
  response.data.user.role
);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

if (response.data.user.role === "SuperAdmin") {
  router.push("/super-admin");
} else {
  router.push("/dashboard");
}
    } catch (error: any) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-black flex items-center justify-center">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Login to your dashboard
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block text-sm text-zinc-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm text-zinc-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >

            {
              loading
                ? "Loading..."
                : "Login"
            }

          </button>

        </form>

      </div>

    </main>

  );

}