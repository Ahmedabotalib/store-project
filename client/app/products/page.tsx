"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
const [role, setRole] = useState("");

const [statusFilter, setStatusFilter] =
  useState("All");
const [typeFilter,setTypeFilter]=
useState("All");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {

    try {

      setLoading(true);

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

  const handleDelete = async (id: number) => {

    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/products/${id}`);

      alert("Product Deleted Successfully");

      fetchProducts();

    } catch (error) {

      console.error(error);

      alert("Delete Failed");

    }

  };

  useEffect(() => {

  const userRole =
    localStorage.getItem("role");

  if (userRole) {

    setRole(userRole);

  }

  fetchProducts();

}, []);
 const filteredProducts = products.filter(

(product)=>{


const matchesSearch=

product.name

.toLowerCase()

.includes(

search.toLowerCase()

);



const matchesStatus=

statusFilter==="All"

? true

: product.status===statusFilter;



const matchesType=

typeFilter==="All"

? true

: product.type===typeFilter;



return (

matchesSearch

&&

matchesStatus

&&

matchesType

);


}

);

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

        {(role === "Admin" ||
  role === "Manager") && (

  <a
    href="/products/add"
    className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition"
  >
    Add Product
  </a>

)}

      </div>
      <div className="flex gap-4 mb-6">

  <input
    type="text"
    placeholder="Search Product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 w-80"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3"
  >
    <option value="All">All</option>
    <option value="Available">Available</option>
    <option value="Rented">Rented</option>
    <option value="Maintenance">Maintenance</option>
  </select>
  <select
value={typeFilter}
onChange={(e)=>setTypeFilter(e.target.value)}
className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3"
>

<option value="All">
All Types
</option>

<option value="SELL">
For Sale
</option>

<option value="RENT">
For Rent
</option>

</select>

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
                 Price
              </th>

              <th className="text-left p-5">
                Stock
              </th>

              <th className="text-left p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="p-5 text-center text-zinc-400"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              filteredProducts.map((product) => (

                <tr
                  key={product.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      {product.image ? (
  <img
    src={`http://localhost:5000/uploads/${product.image}`}
    alt={product.name}
    className="w-14 h-14 rounded-xl object-cover"
  />
) : (
  <div className="w-14 h-14 rounded-xl bg-zinc-700"></div>
)}

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

{product.type === "SELL" ? (

<span className="text-green-400 font-semibold">

Sale :
{product.salePrice} EGP

</span>

) : (

<span className="text-blue-400 font-semibold">

Rent :
{product.rentalPrice} EGP

</span>

)}

</td>

                  <td className="p-5">
                    {product.stock}
                  </td>

                <td className="p-5">
                  

  <div className="flex gap-2">

   {(role === "Admin" ||
  role === "Manager") && (

  <Link
    href={`/products/edit/${product.id}`}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
  >
    Edit
  </Link>

)}

  {role === "Admin" && (

  <button
    onClick={() => handleDelete(product.id)}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
  >
    Delete
  </button>

)}

  </div>

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