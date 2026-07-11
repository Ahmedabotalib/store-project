"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

export default function EditProductPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [formData,setFormData]=useState({

name:"",
category:"",
size:"",
color:"",

salePrice:"",
rentalPrice:"",

type:"SELL",

stock:"",
status:"Available"

});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      setImageFile(file);

      setImagePreview(
        URL.createObjectURL(file)
      );

    }

  };

  const fetchProduct = async () => {

    try {

      const response = await api.get(
        `/products/${id}`
      );

      const product = response.data;

     setFormData({

name:product.name,

category:product.category,

size:product.size,

color:product.color,

salePrice:product.salePrice,

rentalPrice:product.rentalPrice,

type:product.type,

stock:product.stock,

status:product.status


});

      if (product.image) {

        setImagePreview(
          `http://localhost:5000/uploads/${product.image}`
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (id) {

      fetchProduct();

    }

  }, [id]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const form = new FormData();

     form.append("name",formData.name);

form.append("type",formData.type);

form.append("category",formData.category);

form.append("size",formData.size);

form.append("color",formData.color);

form.append("salePrice",formData.salePrice);

form.append("rentalPrice",formData.rentalPrice);

form.append("stock",formData.stock);

form.append("status",formData.status);

      if (imageFile) {

        form.append(
          "image",
          imageFile
        );

      }

      const response = await fetch(
        `http://localhost:5000/products/${id}`,
        {

          method: "PUT",

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

          body: form,

        }
      );

      const data =
        await response.json();

      alert(data.message);

      router.push("/products");

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
          Edit Product
        </h1>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >

        <div className="grid grid-cols-2 gap-6">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />
          <select

name="type"

value={formData.type}

onChange={handleChange}

className="p-3 rounded-xl bg-zinc-800"

>

<option value="SELL">

For Sale

</option>


<option value="RENT">

For Rent

</option>


</select>

          <input
            type="text"
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={formData.color}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

         {
formData.type==="SELL" && (

<input

type="number"

name="salePrice"

placeholder="Sale Price"

value={formData.salePrice}

onChange={handleChange}

className="p-3 rounded-xl bg-zinc-800"

/>

)
}
{
formData.type==="RENT" && (

<input

type="number"

name="rentalPrice"

placeholder="Rental Price"

value={formData.rentalPrice}

onChange={handleChange}

className="p-3 rounded-xl bg-zinc-800"

/>

)
}

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
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

        <div className="mt-6">

          <label className="block mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 rounded-xl bg-zinc-800"
          />

        </div>

        {imagePreview && (

          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-xl mt-4"
          />

        )}

        <button
          type="submit"
          className="mt-8 bg-blue-600 px-6 py-3 rounded-xl"
        >
          Update Product
        </button>

      </form>

    </DashboardLayout>

  );

}