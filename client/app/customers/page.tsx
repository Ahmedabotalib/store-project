"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

export default function CustomersPage() {

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {

    try {

      const response =
        await api.get("/customers");

      setCustomers(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };
  const handleDelete = async (id: number) => {

  const confirmDelete = confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/customers/${id}`);

    alert("Customer Deleted Successfully");

    fetchCustomers();

  } catch (error) {

    console.log(error);

    alert("Delete Failed");

  }

};


  useEffect(() => {

    fetchCustomers();

  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <p>Loading...</p>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-zinc-400">
            Manage Customers
          </p>

        </div>

        <a
          href="/customers/add"
          className="bg-white text-black px-5 py-3 rounded-xl"
        >
          Add Customer
        </a>
        

      </div>

      <div className="bg-zinc-900 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-black">

            <tr>

              <th className="text-left p-5">
                Name
              </th>

              <th className="text-left p-5">
                Phone
              </th>

              <th className="text-left p-5">
                Address
              </th>
              <th className="text-left p-5">
  Actions
</th>

            </tr>

          </thead>

          <tbody>

  {customers.map((customer) => (

    <tr
      key={customer.id}
      className="border-t border-zinc-800"
    >

      <td className="p-5">
        {customer.name}
      </td>

      <td className="p-5">
        {customer.phone}
      </td>

      <td className="p-5">
        {customer.address}
      </td>

      <td className="p-5">

        <div className="flex gap-2">

          <Link
            href={`/customers/${customer.id}`}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition"
          >
            Details
          </Link>

   <Link
  href={`/customers/edit/${customer.id}`}
  style={{
    background: "yellow",
    color: "black",
    padding: "10px 15px",
    borderRadius: "10px",
    fontWeight: "bold"
  }}
>
  Edit
</Link>

          <button
            onClick={() => handleDelete(customer.id)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition"
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  ))}

</tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}