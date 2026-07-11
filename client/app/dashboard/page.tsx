  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
   
  import DashboardLayout from "@/layouts/DashboardLayout";
  import api from "@/services/api";

  export default function DashboardPage() {

    const router = useRouter();
  const [recentRentals, setRecentRentals] =
    useState<any[]>([]);
    const [years, setYears] =
  useState<number[]>([]);
    const [month, setMonth] = useState(
  String(new Date().getMonth() + 1)
);

const [year, setYear] = useState(
  new Date().getFullYear()
);

    const [stats, setStats] = useState({

totalProducts:0,
availableProducts:0,
rentedProducts:0,

totalUsers:0,
totalCustomers:0,

activeRentals:0,

revenue:0,
monthlyRevenue:0,
yearlyRevenue:0,


totalSales:0,
monthlySales:0,
yearlySales:0,
rentalRevenue:0,
salesRevenue:0,
});

    const fetchStats = async () => {

      try {

     const response =
await api.get(
`/dashboard/stats?month=${month}&year=${year}`
);
console.log("Dashboard API");
console.log(response.data);

setStats(response.data);

        setStats(response.data);
        const rentalsResponse =
    await api.get(
      "/dashboard/recent-rentals"
    );

  setRecentRentals(
    rentalsResponse.data
  );
  const yearsResponse =
  await api.get(
    "/dashboard/years"
  );
console.log(yearsResponse.data);
setYears(
  yearsResponse.data
);

      } catch (error) {

        console.log(error);

      }

    };

    useEffect(() => {

    const token = localStorage.getItem("token");

if (!token) {
  router.push("/login");
  return;
}

const user = JSON.parse(localStorage.getItem("user") || "{}");

if (user.role === "SuperAdmin") {
  router.push("/super-admin");
  return;
}

fetchStats();

    },
     [router, month, year]);

    return (

      <DashboardLayout>
<div className="flex gap-4 mb-6">

  <select
    value={month}
    onChange={(e) =>
      setMonth(e.target.value)
    }
    className="bg-zinc-900 p-3 rounded-xl"
  >

    <option value="1">January</option>
    <option value="2">February</option>
    <option value="3">March</option>
    <option value="4">April</option>
    <option value="5">May</option>
    <option value="6">June</option>
    <option value="7">July</option>
    <option value="8">August</option>
    <option value="9">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>

  </select>

  <select
  value={year}
  onChange={(e) =>
    setYear(Number(e.target.value))
  }
  className="bg-zinc-900 p-3 rounded-xl"
>
 {years.map((year) => (

  <option
    key={year}
    value={year}
  >
    {year}
  </option>

))}
  </select>

</div>
  <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h3 className="text-zinc-400 mb-2">
              Products
            </h3>

            <p className="text-3xl font-bold">
              {stats.totalProducts}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h3 className="text-zinc-400 mb-2">
              Available
            </h3>

            <p className="text-3xl font-bold text-green-400">
              {stats.availableProducts}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h3 className="text-zinc-400 mb-2">
              Rented
            </h3>

            <p className="text-3xl font-bold text-yellow-400">
              {stats.rentedProducts}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl">

            <h3 className="text-zinc-400 mb-2">
              Users
            </h3>
            

            <p className="text-3xl font-bold">
              {stats.totalUsers}
            </p>


          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">

    <h3 className="text-zinc-400 mb-2">
      Customers
    </h3>

    <p className="text-3xl font-bold">
      {stats.totalCustomers}
    </p>

  </div>

  <div className="bg-zinc-900 p-6 rounded-2xl">

    <h3 className="text-zinc-400 mb-2">
      Active Rentals
    </h3>

    <p className="text-3xl font-bold text-blue-400">
      {stats.activeRentals}
    </p>

  </div>

  <div className="bg-zinc-900 p-6 rounded-2xl">

    <h3 className="text-zinc-400 mb-2">
      Revenue
    </h3>

    <p className="text-3xl font-bold text-green-400">
      {stats.revenue} EGP
    </p>

  </div>
  <div className="bg-zinc-900 p-6 rounded-2xl">

<h3 className="text-zinc-400 mb-2">
Rental Revenue
</h3>

<p className="text-3xl font-bold text-blue-400">

{stats.rentalRevenue}

EGP

</p>

</div>
<div className="bg-zinc-900 p-6 rounded-2xl">

<h3 className="text-zinc-400 mb-2">
Sales Revenue
</h3>

<p className="text-3xl font-bold text-green-400">

{stats.salesRevenue}

EGP

</p>

</div>
  <div className="bg-zinc-900 p-6 rounded-2xl">

  <h3 className="text-zinc-400 mb-2">
    Monthly Revenue
  </h3>

  <p className="text-3xl font-bold text-blue-400">
    {stats.monthlyRevenue} EGP
  </p>

</div>

<div className="bg-zinc-900 p-6 rounded-2xl">

  <h3 className="text-zinc-400 mb-2">
    Yearly Revenue
  </h3>

  <p className="text-3xl font-bold text-purple-400">
    {stats.yearlyRevenue} EGP
  </p>

</div>
<div className="bg-zinc-900 p-6 rounded-2xl">

<h3 className="text-zinc-400 mb-2">
Total Sales
</h3>

<p className="text-3xl font-bold text-green-400">
{stats.totalSales}
</p>

</div>




<div className="bg-zinc-900 p-6 rounded-2xl">

<h3 className="text-zinc-400 mb-2">
Monthly Sales
</h3>

<p className="text-3xl font-bold text-blue-400">
{stats.monthlySales}
</p>

</div>




<div className="bg-zinc-900 p-6 rounded-2xl">

<h3 className="text-zinc-400 mb-2">
Yearly Sales
</h3>

<p className="text-3xl font-bold text-purple-400">
{stats.yearlySales}
</p>

</div>
  </div>

  <div className="mt-10 bg-zinc-900 rounded-2xl overflow-hidden">

    <div className="p-6 border-b border-zinc-800">

      <h2 className="text-xl font-bold">
        Recent Rentals
      </h2>

    </div>

    <table className="w-full">

      <thead className="bg-black">

        <tr>

          <th className="p-4 text-left">
            Customer
          </th>

          <th className="p-4 text-left">
            Product
          </th>

          <th className="p-4 text-left">
            Price
          </th>

          <th className="p-4 text-left">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {recentRentals.map((rental) => (

          <tr
            key={rental.id}
            className="border-t border-zinc-800"
          >

            <td className="p-4">
              {rental.customer?.name}
            </td>

            <td className="p-4">
              {rental.product?.name}
            </td>

            <td className="p-4">
              {rental.totalPrice} EGP
            </td>

            <td className="p-4">
              {rental.status}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

        
        

      </DashboardLayout>

    );

  }