"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
;
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Store = {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;

  plan: string;
  subscriptionStart: string;
  subscriptionEnd: string;

  users: User[];
  products: unknown[];
  customers: unknown[];
};

export default function StoresPage() {

  const [stores, setStores] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
const [selectedStore, setSelectedStore] = useState<Store | null>(null);
const [renewOpen, setRenewOpen] = useState(false);
const [search, setSearch] = useState("");
const [plan, setPlan] = useState("Monthly")
const [formData, setFormData] = useState({
  storeName: "",
  phone: "",
  adminName: "",
  email: "",
  password: "",
});

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {

    try {

      const res = await api.get("/stores");

      setStores(res.data);

    } catch (err) {

      console.log(err);

    }

  };
  const filteredStores = stores.filter((store) => {
  const admin = store.users.find((u) => u.role === "Admin");

  return (
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    admin?.name?.toLowerCase().includes(search.toLowerCase()) ||
    admin?.email?.toLowerCase().includes(search.toLowerCase())
  );
});
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  setFormData({

    ...formData,

    [e.target.name]: e.target.value,

  });

};

const handleCreateStore = async () => {

  try {

    await api.post("/stores", formData);

    alert("Store Created");

    setOpen(false);

    fetchStores();

  } catch (error) {

    console.log(error);

    alert("Failed");

  }

};
const handleRenew = async () => {

  if (!selectedStore) return;

  try {

    await api.put(

      `/stores/${selectedStore.id}/renew`,

      {
        plan,
      }

    );

    alert("Subscription Renewed");

    setSelectedStore(null);

    fetchStores();

  } catch (error) {

    console.log(error);

    alert("Failed");

  }

};

  return (

<div className="space-y-6">

<div className="flex justify-between items-center">

<h1 className="text-3xl font-bold">

Stores Management

</h1>

<button

onClick={() => setOpen(true)}

className="bg-white text-black px-5 py-3 rounded-xl font-semibold"

>

+ New Store

</button>

</div>
<div className="mb-6">
  <input
    type="text"
    placeholder="Search by Store Name / Admin / Email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
  />
</div>
<div className="bg-zinc-900 rounded-2xl overflow-hidden">

<table className="w-full">

<thead className="bg-black">

<tr>

<th className="p-4 text-left">Store</th>

<th className="p-4 text-left">Admin</th>

<th className="p-4 text-left">Email</th>

<th className="p-4 text-left">Phone</th>
<th className="p-4 text-left">Plan</th>
<th className="p-4 text-left">Days Left</th>
<th className="p-4 text-left">Users</th>

<th className="p-4 text-left">Products</th>

<th className="p-4 text-left">Customers</th>

<th className="p-4 text-left">Subscription</th>

<th className="p-4 text-left">Status</th>

<th className="p-4 text-left">Actions</th>
</tr>

</thead>

<tbody>

{filteredStores.map((store) => {

const admin =
store.users.find(
(u) => u.role === "Admin"
);
const today = new Date();

const end = new Date(store.subscriptionEnd);

const daysLeft = Math.ceil(
  (end.getTime() - today.getTime()) /
  (1000 * 60 * 60 * 24)
);
const handleToggleStatus = async (id: number) => {

  try {

    await api.put(`/stores/${id}/toggle-status`);

    fetchStores();

  } catch (error) {

    console.log(error);

  }

};
return (

<tr
key={store.id}
className="border-t border-zinc-800"
>

<td className="p-4">

{store.name}

</td>

<td className="p-4">

{admin?.name}

</td>

<td className="p-4">

{admin?.email}

</td>

<td className="p-4">

{store.phone}

</td>
<td className="p-4">
  {store.plan}
</td>

<td className="p-4">
  {daysLeft > 0 ? (
    <span className="text-green-400">
      {daysLeft} Days
    </span>
  ) : (
    <span className="text-red-400">
      Expired
    </span>
  )}
</td>

<td className="p-4">

{store.users.length}

</td>

<td className="p-4">

{store.products.length}

</td>

<td className="p-4">

{store.customers.length}

</td>

<td className="p-4">

{new Date(
store.subscriptionEnd
).toLocaleDateString()}

</td>

<td className="p-4">
  {store.isActive ? (
    <span className="text-green-400">
      🟢 Active
    </span>
  ) : (
    <span className="text-red-400">
      🔴 Disabled
    </span>
  )}
</td>

<td className="p-4 flex gap-2">

  <button
   onClick={() => {
  setSelectedStore(store);
  setPlan(store.plan);
  setRenewOpen(true);
}}
    className="bg-blue-600 px-3 py-2 rounded-lg"
  >
    Renew
  </button>

 <button

onClick={() => handleToggleStatus(store.id)}

className={`px-3 py-2 rounded-lg text-white ${
  store.isActive
    ? "bg-red-600 hover:bg-red-700"
    : "bg-green-600 hover:bg-green-700"
}`}

>

{store.isActive ? "Disable" : "Enable"}

</button>

</td>

</tr>

);

})}

</tbody>

</table>

</div>
{
open && (
  

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<div className="bg-zinc-900 p-8 rounded-2xl w-[500px]">

<h2 className="text-2xl font-bold mb-6">

Create Store

</h2>

<div className="space-y-4">

<input
name="storeName"
placeholder="Store Name"
onChange={handleChange}
className="w-full p-3 rounded-xl bg-zinc-800"
/>

<input
name="phone"
placeholder="Phone"
onChange={handleChange}
className="w-full p-3 rounded-xl bg-zinc-800"
/>

<input
name="adminName"
placeholder="Admin Name"
onChange={handleChange}
className="w-full p-3 rounded-xl bg-zinc-800"
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
className="w-full p-3 rounded-xl bg-zinc-800"
/>

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
className="w-full p-3 rounded-xl bg-zinc-800"
/>

</div>

<div className="flex justify-end gap-3 mt-8">

<button

onClick={() => setOpen(false)}

className="bg-zinc-700 px-5 py-3 rounded-xl"

>

Cancel

</button>

<button

onClick={handleCreateStore}

className="bg-white text-black px-5 py-3 rounded-xl"

>

Create

</button>

</div>

</div>

</div>

)

}
{
renewOpen && selectedStore && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

  <div className="bg-zinc-900 p-8 rounded-2xl w-[450px]">

    <h2 className="text-2xl font-bold mb-6">

      Renew Subscription

    </h2>

    <p className="mb-6 text-zinc-300">

      Store :
      <span className="font-bold ml-2">
        {selectedStore.name}
      </span>

    </p>

    <select

      value={plan}

      onChange={(e)=>setPlan(e.target.value)}

      className="w-full p-3 rounded-xl bg-zinc-800"

    >

      <option value="Monthly">

        Monthly

      </option>

      <option value="Yearly">

        Yearly

      </option>

    </select>

    <div className="flex justify-end gap-3 mt-8">

      <button

        onClick={()=>{
          setRenewOpen(false);
          setSelectedStore(null);
        }}

        className="bg-zinc-700 px-5 py-3 rounded-xl"

      >

        Cancel

      </button>

      <button

        onClick={async()=>{

          await handleRenew();

          setRenewOpen(false);

        }}

        className="bg-blue-600 px-5 py-3 rounded-xl"

      >

        Confirm

      </button>

    </div>

  </div>

</div>

)
}
</div>

  );

}