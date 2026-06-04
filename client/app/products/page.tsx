"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function ProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

     const response = await api.get("/products");

const data = response.data;

      console.log("Products API Response:", data);

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

      setProducts([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <p className="text-white text-xl">
          Loading Products...
        </p>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-zinc-400 mt-1">
            Manage all products
          </p>

        </div>

        <a
          href="/products/add"
          className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Add Product
        </a>

      </div>

      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">

        <table className="w-full">

          <thead className="bg-black">

            <tr>

              <th className="text-left p-5">
                Product
              </th>

              <th className="text-left p-5">
                Category
              </th>

              <th className="text-left p-5">
                Size
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Rental Price
              </th>

              <th className="text-left p-5">
                Stock
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="p-5 text-center text-zinc-400"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-xl bg-zinc-700"></div>

                      <div>

                        <h3 className="font-semibold">
                          {product.name}
                        </h3>

                        <p className="text-zinc-400 text-sm">
                          {product.color}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-5">
                    {product.category}
                  </td>

                  <td className="p-5">
                    {product.size}
                  </td>

                  <td className="p-5">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.status === "Available"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {product.status}
                    </span>

                  </td>

                  <td className="p-5">
                    {product.rentalPrice} EGP
                  </td>

                  <td className="p-5">
                    {product.stock}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}