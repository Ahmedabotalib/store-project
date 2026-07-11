"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

export default function EditUserPage() {

  const router = useRouter();

  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    role: "Employee",

  });

  const fetchUser = async () => {

    try {

      const response =
        await api.get(
          `/users/${params.id}`
        );

      setFormData({

        name: response.data.name,

        email: response.data.email,

        role: response.data.role,

      });

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchUser();

  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.put(

        `/users/${params.id}`,

        formData

      );

      alert(
        "User Updated Successfully"
      );

      router.push("/users");

    } catch (error) {

      console.log(error);

      alert(
        "Failed To Update User"
      );

    }

  };

  if (loading) {

    return (

      <DashboardLayout>

        <p>Loading User...</p>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        Edit User
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
          Save Changes
        </button>

      </form>

    </DashboardLayout>

  );

}