"use client";


import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";


export default function CustomerDetails(){


const params=

useParams();


type CustomerType = {
  name: string;
  phone: string;

  rentals: any[];
};

const [customer, setCustomer] =
useState<CustomerType | null>(null);

const [totalPaid,setTotalPaid]=useState(0);


useEffect(()=>{


fetchCustomer();


},[]);



const fetchCustomer=async()=>{


const response=

await api.get(

`/customers/${params.id}/details`

);



setCustomer(

response.data.customer

);


setTotalPaid(

response.data.totalPaid

);



};



if (!customer) {
  return (
    <DashboardLayout>
      <p>Loading...</p>
    </DashboardLayout>
  );
}



return (

  <DashboardLayout>

<div className="bg-zinc-900 p-8 rounded-2xl">

  <h1 className="text-4xl font-bold mb-4">

    {customer.name}

  </h1>

  <p className="text-zinc-400">

    Phone : {customer.phone}

  </p>

  <p className="mt-4">

    Total Paid : {totalPaid} EGP

  </p>

  <p>

    Total Rentals : {customer.rentals.length}

  </p>

</div>

  </DashboardLayout>

);
}