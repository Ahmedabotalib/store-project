"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

export default function EditCustomerPage() {

const { id } = useParams();

const router = useRouter();

const [loading, setLoading] = useState(true);

const [formData, setFormData] = useState({

name: "",

phone: "",

address: "",

});

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const { name, value } = e.currentTarget;

  setFormData({

    ...formData,

    [name]: value,

  });

};

const fetchCustomer = async () => {

try {

  const response =
    await api.get(`/customers/${id}`);

  const customer =
    response.data;

  setFormData({

    name: customer.name || "",

    phone: customer.phone || "",

    address: customer.address || "",

  });

} catch (error) {

  console.log(error);

} finally {

  setLoading(false);

}

};

useEffect(() => {

if (id) {

  fetchCustomer();

}

}, [id]);

const handleSubmit = async (
e: React.FormEvent
) => {

e.preventDefault();

try {

  const token =
    localStorage.getItem("token");

  const response = await fetch(

    `http://localhost:5000/customers/${id}`,

    {

      method: "PUT",

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

  alert("Update Failed");

}

};

if (loading) {

return (

  <DashboardLayout>

    <p>Loading...</p>

  </DashboardLayout>

);

}

return (

<DashboardLayout>

  <div className="mb-8">

    <h1 className="text-3xl font-bold">

      Edit Customer

    </h1>

  </div>

  <form

    onSubmit={handleSubmit}

    className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"

  >

    <div className="grid grid-cols-1 gap-6">

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

      className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white"

    >

      Update Customer

    </button>

  </form>

</DashboardLayout>

);

}