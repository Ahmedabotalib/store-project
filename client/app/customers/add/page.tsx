"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCustomerPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    name: "",
    phone: "",
    address: "",

  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/customers",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify(formData),

        }
      );

      const data =
        await response.json();

      alert(data.message);

      router.push("/customers");

    } catch (error) {

      console.log(error);

      alert("Failed");

    }

  };

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Customer
        </h1>

        <p className="text-zinc-400 mt-2">
          Create New Customer
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >

        <div className="grid gap-6">

          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

        </div>

        <button
          type="submit"
          className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add Customer
        </button>

      </form>

    </DashboardLayout>

  );

}