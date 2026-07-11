"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import api from "@/services/api";
export default function StoresPage(){
const [storeName,setStoreName]=useState("");
const [phone,setPhone]=useState("");

const [adminName,setAdminName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const createStore = async()=>{

try{

await api.post(

"/stores",

{

storeName,
phone,

adminName,

email,

password

}

);

alert("Store Created Successfully");

}

catch(error){

console.log(error);

alert("Error Creating Store");

}

}
return(

<DashboardLayout>

<div className="space-y-4">

<input

placeholder="Store Name"

value={storeName}

onChange={(e)=>setStoreName(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800"

/>


<input

placeholder="Phone"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800"

/>


<input

placeholder="Admin Name"

value={adminName}

onChange={(e)=>setAdminName(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800"

/>


<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800"

/>


<input

placeholder="Password"

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800"

/>


<button

onClick={createStore}

className="bg-green-600 px-5 py-3 rounded-xl"

>

Create Store

</button>


</div>
</DashboardLayout>

)

}