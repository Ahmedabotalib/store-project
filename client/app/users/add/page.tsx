"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

export default function AddUserPage() {

  const router = useRouter();
const [showPassword, setShowPassword] =
  useState(false);
  const [formData, setFormData] = useState({
    
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.post(
        "/users",
        formData
      );

      alert("User Added Successfully");

      router.push("/users");

    } catch (error) {

      console.log(error);

      alert("Failed To Add User");

    }

  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        Add User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl max-w-2xl space-y-6"
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-zinc-700"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-zinc-700"
        />

<input
  type={
    showPassword
      ? "text"
      : "password"
  }
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  className="w-full p-4 rounded-xl bg-black border border-zinc-700"
/>
<button
  type="button"
  onClick={() =>
    setShowPassword(!showPassword)
  }
  className="text-blue-400 hover:text-blue-300"
>
  {showPassword
    ? "Hide Password"
    : "Show Password"}
</button>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-black border border-zinc-700"
        >
          <option value="Admin">
  Admin
</option>

<option value="Manager">
  Manager
</option>

<option value="Cashier">
  Cashier
</option>

<option value="Employee">
  Employee
</option>
        </select>

        <button
          type="submit"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add User
        </button>

      </form>

    </DashboardLayout>

  );

}