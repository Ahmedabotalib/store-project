"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import { useEffect,useState } from "react";
import Link from "next/link";
import jsPDF from 'jspdf'
export default function SalesPage(){

const [sales,setSales]=useState([]);
const [loading,setLoading]=useState(true);

const [searchCustomer, setSearchCustomer] = useState("");
const [searchProduct, setSearchProduct] = useState("");
const [searchDate, setSearchDate] = useState("");
const fetchSales=async()=>{

try{

const response=
await api.get("/sales");


setSales(response.data);


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};
// Generate PDF Invoice

const generateInvoice = (sale:any)=>{


const doc = new jsPDF();


doc.setFontSize(20);

doc.text("SUIT RENTAL",70,20);


doc.setFontSize(12);

doc.text(

`Invoice #${sale.id}`,

20,

40

);


doc.text(

`Date : ${new Date(
sale.soldAt
).toLocaleDateString()}`,

20,

50

);


doc.text(

`Customer : ${sale.customer.name}`,

20,

70

);


doc.text(

`Product : ${sale.product.name}`,

20,

80

);


doc.text(

`Quantity : ${sale.quantity}`,

20,

90

);


doc.text(

`Total : ${sale.totalPrice} EGP`,

20,

100

);



doc.save(

`Invoice-${sale.id}.pdf`

);


}

useEffect(()=>{

fetchSales();

},[]);

const filteredSales = sales.filter((sale: any) => {

  const customerMatch =
    sale.customer?.name
      ?.toLowerCase()
      .includes(searchCustomer.toLowerCase());

  const productMatch =
    sale.product?.name
      ?.toLowerCase()
      .includes(searchProduct.toLowerCase());

  const dateMatch =
    searchDate === ""
      ? true
      : sale.soldAt.startsWith(searchDate);

  return (
    customerMatch &&
    productMatch &&
    dateMatch
  );

});

if(loading){

return(

<DashboardLayout>

Loading...

</DashboardLayout>

)

}



return(

<DashboardLayout>


<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-bold">

Sales

</h1>


<p className="text-zinc-400">

Manage Sales

</p>


</div>



<Link

href="/sales/add"

className="bg-white text-black px-5 py-3 rounded-xl"

>

New Sale

</Link>




</div>


<div className="flex gap-4 mb-6">

<input
placeholder="Search Customer"
value={searchCustomer}
onChange={(e)=>setSearchCustomer(e.target.value)}
className="bg-zinc-900 p-3 rounded-xl border border-zinc-700"
/>


<input
placeholder="Search Product"
value={searchProduct}
onChange={(e)=>setSearchProduct(e.target.value)}
className="bg-zinc-900 p-3 rounded-xl border border-zinc-700"
/>


<input
type="date"
value={searchDate}
onChange={(e)=>setSearchDate(e.target.value)}
className="bg-zinc-900 p-3 rounded-xl border border-zinc-700"
/>

</div>

<div className="bg-zinc-900 rounded-2xl overflow-hidden">


<table className="w-full">


<thead className="bg-black">


<tr>


<th className="p-5 text-left">

Customer

</th>



<th className="p-5 text-left">

Product

</th>



<th className="p-5 text-left">

Qty

</th>



<th className="p-5 text-left">

Total

</th>



<th className="p-5 text-left">

Date

</th>

<th className="p-5 text-left">

	Receipt

</th>

</tr>


</thead>




<tbody>


{sales.length===0 ? (

<tr>

<td
colSpan={5}
className="p-5 text-center text-zinc-400"
>

No Sales Yet

</td>

</tr>

) : (
filteredSales.map((sale:any)=>(


<tr

key={sale.id}

className="border-t border-zinc-800"

>



<td className="p-5">

{sale.customer?.name || "Deleted Customer"}

</td>



<td className="p-5">

{sale.product?.name || "Deleted Product"}

</td>



<td className="p-5">

{sale.quantity}

</td>



<td className="p-5 font-semibold text-green-400">

{sale.totalPrice} EGP

</td>



<td className="p-5">

{new Date(sale.soldAt)
.toLocaleDateString("en-GB")}

</td>

<td className="p-5">

<button
onClick={() => generateInvoice(sale)}
className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition"
>

Receipt

</button>

</td>

</tr>



)))}


</tbody>


</table>


</div>




</DashboardLayout>

)

}