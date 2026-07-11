"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import { useEffect, useState } from "react";

export default function AddSalePage() {

const [customers,setCustomers]=useState<any[]>([]);
const [products,setProducts]=useState<any[]>([]);

const [customerId,setCustomerId]=useState("");
const [productId,setProductId]=useState("");

const [quantity,setQuantity]=useState(1);
const [soldAt,setSoldAt]=useState("");

const [loading,setLoading]=useState(true);



const fetchData = async()=>{

try{

const customersResponse =
await api.get("/customers");


const productsResponse =
await api.get("/products");


setCustomers(customersResponse.data);


setProducts(

productsResponse.data.filter(

(product:any)=>product.type==="SELL"

)

);
}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

}



useEffect(()=>{

fetchData();

},[]);




const selectedProduct = products.find(

(product:any)=>

product.id === Number(productId)

);





const handleSubmit = async()=>{


if(!customerId || !productId || !soldAt){

alert("Please Fill All Fields");

return;

}



try{

if(selectedProduct && quantity > selectedProduct.stock){

alert("Not enough stock");

return;

}
await api.post("/sales",{

customerId,


productId,

quantity,

soldAt


});


alert("Sale Created Successfully");



setCustomerId("");
setProductId("");
setQuantity(1);
setSoldAt("");

}

catch(error:any){

console.log(error);

console.log(error.response?.data);

alert(

error.response?.data?.message ||

"Something Went Wrong"

);

}



};






if(loading){

return(

<DashboardLayout>

Loading...

</DashboardLayout>

)

}





return(

<DashboardLayout>


<div className="max-w-3xl mx-auto">


<h1 className="text-3xl font-bold mb-8">

Create Sale

</h1>



<div className="bg-zinc-900 p-8 rounded-2xl">


<label className="block mb-2">

Customer

</label>


<select

value={customerId}

onChange={(e)=>setCustomerId(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800 mb-6"

>

<option value="">

Select Customer

</option>



{customers.map((customer:any)=>(


<option

key={customer.id}

value={customer.id}

>

{customer.name}

</option>


))}


</select>







<label className="block mb-2">

Product

</label>



<select

value={productId}

onChange={(e)=>setProductId(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800 mb-6"

>


<option value="">

Select Product

</option>



{products.map((product:any)=>(


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

Price :

{selectedProduct.salePrice}

EGP

</p>


<p>

Stock :

{selectedProduct.stock}

</p>



</div>

)}






<label className="block mb-2">

Quantity

</label>


<input

type="number"

min="1"

max={selectedProduct?.stock || 1}

value={quantity}

onChange={(e)=>setQuantity(Number(e.target.value))}

className="w-full p-3 rounded-xl bg-zinc-800 mb-6"

/>





{selectedProduct && (

<p className="mb-6 text-xl font-bold">

Total :

{selectedProduct.salePrice * quantity}

EGP


</p>

)}





<label className="block mb-2">

Date

</label>



<input

type="date"

value={soldAt}

onChange={(e)=>setSoldAt(e.target.value)}

className="w-full p-3 rounded-xl bg-zinc-800 mb-6"

/>





<button

onClick={handleSubmit}

className="bg-white text-black px-6 py-3 rounded-xl"

>

Create Sale

</button>



</div>


</div>



</DashboardLayout>


)

}