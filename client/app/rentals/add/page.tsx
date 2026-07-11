"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function AddRentalPage() {

  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    startDate: "",
    endDate: "",
    totalPrice: "",
  });

  useEffect(() => {

    const fetchData = async () => {

      try {

        const customersRes =await api.get("/customers");

        const productsRes =await api.get("/products");

        setCustomers(customersRes.data);
     setProducts(

productsRes.data.filter(

(product:any)=>

product.type==="RENT"

)

);

      } catch (error) {

        console.log(error);

      }

    };

    fetchData();

  }, []);
  const selectedProduct = products.find(

(product:any)=>

product.id === Number(formData.productId)

);

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {
if(

selectedProduct &&

selectedProduct.stock <= 0

){

alert(

"This Product Is Not Available"

);

return;

}
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/rentals",
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


setFormData({

customerId:"",

productId:"",

startDate:"",

endDate:"",

totalPrice:""

});


router.push("/rentals");

    } catch (error) {

      console.log(error);

      alert("Create Rental Failed");

    }

  };

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Rental
        </h1>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >

        <div className="grid grid-cols-2 gap-6">

          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          >

            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (

              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>

            ))}

          </select>

          <select
          
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          >
            
            

            <option value="">
              Select Product
            </option>

            {products.map((product) => (

              <option

key={product.id}

value={product.id}

disabled={product.stock===0}

>

{product.name}

({product.stock})

</option>

            ))}

          </select>
          {selectedProduct && (

<div className="mb-6 p-4 rounded-xl bg-zinc-800">

<p>

Rental Price :

{selectedProduct.rentalPrice}

EGP

</p>


<p>

Stock :

{selectedProduct.stock}

</p>


</div>

)}

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            name="totalPrice"
            placeholder="Total Price"
            value={formData.totalPrice}
            onChange={handleChange}
            className="p-3 rounded-xl bg-zinc-800"
          />

        </div>

        <button
          type="submit"
          className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white"
        >
          Create Rental
        </button>

      </form>

    </DashboardLayout>

  );

}