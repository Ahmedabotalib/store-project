"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function RentalsPage() {

  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleReturn = async (id: number) => {

  try {

    await api.put(
      `/rentals/return/${id}`
    );

    alert("Rental Returned");

    fetchRentals();

  } catch (error) {

    console.log(error);

    alert("Return Failed");

  }

};
  const fetchRentals = async () => {

    try {

      const response =
        await api.get("/rentals");

      setRentals(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchRentals();

  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <p>Loading Rentals...</p>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Rentals
          </h1>

          <p className="text-zinc-400">
            Manage Rentals
          </p>

        </div>

        <a
          href="/rentals/add"
          className="bg-white text-black px-5 py-3 rounded-xl"
        >
          Add Rental
        </a>

      </div>

      <div className="bg-zinc-900 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-black">

            <tr>

              <th className="text-left p-5">
                Customer
                
              </th>

              <th className="text-left p-5">
                Product
              </th>

              <th className="text-left p-5">
                Start Date
              </th>

              <th className="text-left p-5">
                End Date
              </th>

              <th className="text-left p-5">
                Total Price
              </th>

              <th className="text-left p-5">
                Status
              </th>
              <th className="text-left p-5">
  Actions
</th>

            </tr>

          </thead>

          <tbody>

            {rentals.map((rental) => (

              <tr
                key={rental.id}
                className="border-t border-zinc-800"
              >

                <td className="p-5">
                  {rental.customer?.name}
                </td>

                <td className="p-5">
                  {rental.product?.name}
                </td>

                <td className="p-5">
                  {new Date(
                    rental.startDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-5">
                  {new Date(
                    rental.endDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-5">
                  {rental.totalPrice} EGP
                </td>

                <td className="p-5">

                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">

                    {rental.status}

                  </span>

                </td>
                <td className="p-5">

  {rental.status === "Active" && (

    <button
      onClick={() => handleReturn(rental.id)}
      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
    >
      Return
    </button>

  )}

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}