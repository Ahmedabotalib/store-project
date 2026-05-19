"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";

export default function ProductsPage() {

  const [products, setProducts] = useState<any[]>([]);

  // FETCH PRODUCTS

  const fetchProducts = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/products"
      );

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  return (

    <DashboardLayout>

      {/* HEADER */}

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

      {/* TABLE */}

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

            {products.map((product) => (

              <tr
                key={product.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
              >

                {/* PRODUCT */}

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

                {/* CATEGORY */}

                <td className="p-5">
                  {product.category}
                </td>

                {/* SIZE */}

                <td className="p-5">
                  {product.size}
                </td>

                {/* STATUS */}

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

                {/* RENTAL PRICE */}

                <td className="p-5">
                  {product.rentalPrice} EGP
                </td>

                {/* STOCK */}

                <td className="p-5">
                  {product.stock}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );
}