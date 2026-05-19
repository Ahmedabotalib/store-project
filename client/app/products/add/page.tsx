"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";

export default function AddProductPage() {

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    salePrice: "",
    rentalPrice: "",
    stock: "",
    status: "Available",
  });

  // 1- IMAGE PREVIEW STATE

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // HANDLE INPUT CHANGE

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // 2- HANDLE IMAGE CHANGE

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      const imageUrl = URL.createObjectURL(file);

      setImagePreview(imageUrl);

    }

  };

  // HANDLE SUBMIT

  const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  try {

    const response = await fetch(
      "http://localhost:5000/products",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    console.log(data);

    alert("Product Added Successfully");

    // RESET FORM

    setFormData({
      name: "",
      category: "",
      size: "",
      color: "",
      salePrice: "",
      rentalPrice: "",
      stock: "",
      status: "Available",
    });

    setImagePreview(null);

  } catch (error) {

    console.error(error);

    alert("Something went wrong");

  }

};
  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <p className="text-zinc-400 mt-2">
          Create a new product
        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >

        <div className="grid grid-cols-2 gap-6">

          {/* NAME */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Classic Suit"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="Wedding"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* SIZE */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Size
            </label>

            <input
              type="text"
              name="size"
              placeholder="L"
              value={formData.size}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* COLOR */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Color
            </label>

            <input
              type="text"
              name="color"
              placeholder="Black"
              value={formData.color}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* SALE PRICE */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Sale Price
            </label>

            <input
              type="number"
              name="salePrice"
              placeholder="4500"
              value={formData.salePrice}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* RENTAL PRICE */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Rental Price
            </label>

            <input
              type="number"
              name="rentalPrice"
              placeholder="500"
              value={formData.rentalPrice}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* STOCK */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              placeholder="5"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            />

          </div>

          {/* STATUS */}

          <div>

            <label className="block mb-2 text-sm text-zinc-300">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:border-white"
            >

              <option value="Available">
                Available
              </option>

              <option value="Rented">
                Rented
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

            </select>

          </div>

          {/* 5- IMAGE INPUT */}

          <div className="col-span-2">

            <label className="block mb-2 text-sm text-zinc-300">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
            />

          </div>

        </div>

        {/* IMAGE PREVIEW */}

        {imagePreview && (

          <div className="mt-6">

            <p className="mb-3 text-zinc-300">
              Image Preview
            </p>

            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-2xl border border-zinc-700"
            />

          </div>

        )}

        {/* BUTTON */}

        <button
          type="submit"
          className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Add Product
        </button>

      </form>

    </DashboardLayout>

  );
}