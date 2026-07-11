"use client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";
type SubscriptionAlert = {
  id: number;
  name: string;
  subscriptionEnd: string;
  isActive: boolean;
};
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

  subscriptionEnd: string;
  createdAt: string;

  users: User[];
};
type DashboardStats = {
  totalStores: number;
  activeStores: number;
  disabledStores: number;
  totalUsers: number;
  totalProducts: number;
  totalCustomers: number;
  expiredStores: number;
  monthlyRevenue: number;

  subscriptionAlerts: SubscriptionAlert[];
  recentStores: Store[];
};

export default function SuperAdminPage() {

  const [stats, setStats] = useState<DashboardStats>({

    totalStores: 0,

    activeStores: 0,

    disabledStores: 0,

    totalUsers: 0,

    totalProducts: 0,

    totalCustomers: 0,

    expiredStores: 0,

    monthlyRevenue: 0,
    subscriptionAlerts: [],
    recentStores: [],

  });

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const res =
        await api.get("/super-admin/dashboard");

      setStats(res.data);

    } catch (error) {

      console.log(error);

    }

  };
const cards = [
  {
    title: "Stores",
    value: stats.totalStores,
    color: "text-blue-400",
    icon: "🏪",
  },
  {
    title: "Users",
    value: stats.totalUsers,
    color: "text-green-400",
    icon: "👥",
  },
  {
    title: "Products",
    value: stats.totalProducts,
    color: "text-yellow-400",
    icon: "📦",
  },
  {
    title: "Customers",
    value: stats.totalCustomers,
    color: "text-purple-400",
    icon: "👤",
  },
  {
    title: "Active Stores",
    value: stats.activeStores,
    color: "text-emerald-400",
    icon: "🟢",
  },
  {
    title: "Disabled Stores",
    value: stats.disabledStores,
    color: "text-red-400",
    icon: "🔴",
  },
  {
    title: "Expired Stores",
    value: stats.expiredStores,
    color: "text-orange-400",
    icon: "⏰",
  },
  {
    title: "Monthly Revenue",
    value: `${stats.monthlyRevenue} EGP`,
    color: "text-cyan-400",
    icon: "💰",
  },
];
const renewStore = async (
  id: number,
  plan: string = "Monthly"
) => {
  try {
    await api.put(`/stores/${id}/renew`, {
      plan,
    });

    fetchDashboard();

    alert("Subscription Renewed Successfully");
  } catch (err) {
    console.log(err);
    alert("Renew Failed");
  }
};
  return (

<div>

<div className="flex items-center justify-between mb-8">

  <div>

    <h1 className="text-4xl font-bold text-white">

      Super Admin

    </h1>

    <p className="text-zinc-400 mt-2">

      Manage all stores, subscriptions and platform statistics

    </p>

  </div>

</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (

    <div
      key={card.title}
      className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition"
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="text-zinc-400">
            {card.title}
          </p>

          <h2 className={`text-3xl font-bold mt-3 ${card.color}`}>
            {card.value}
          </h2>
        </div>

        <div className="text-4xl">
          {card.icon}
        </div>

      </div>
    </div>

  ))}

</div>

<div className="mt-10 bg-zinc-900 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-6">
    Subscription Alerts
  </h2>

  {
    stats.subscriptionAlerts.length === 0 ? (

      <p className="text-zinc-400">
        No Alerts 🎉
      </p>

    ) : (

      <div className="space-y-4">

        {
          stats.subscriptionAlerts.map((store) => (

            <div
              key={store.id}
              className="flex justify-between items-center border-b border-zinc-800 pb-3"
            >

              <div>

                <h3 className="font-semibold">
                  {store.name}
                </h3>

                <p className="text-zinc-400 text-sm">

                  {
                    new Date(store.subscriptionEnd) < new Date()

                      ? "Expired"

                      : `Ends ${new Date(
                          store.subscriptionEnd
                        ).toLocaleDateString()}`
                  }

                </p>

              </div>

             <button
onClick={() => renewStore(store.id)}
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
>
  Renew
</button>

            </div>

          ))
        }

      </div>

    )
  }

</div>
<div className="mt-8 bg-zinc-900 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-6">

    Recent Stores

  </h2>

  <div className="space-y-4">

    {stats.recentStores.map((store) => {

      const admin =
        store.users.find((u) => u.role === "Admin");

      return (

        <div
          key={store.id}
          className="flex justify-between items-center border-b border-zinc-800 pb-3"
        >

          <div>

            <h3 className="font-semibold text-lg">

              🏪 {store.name}

            </h3>

            <p className="text-zinc-400">

              Admin :
              {" "}
              {admin?.name}

            </p>

          </div>

          <div className="text-right">

            <p className="text-zinc-400 text-sm">

              {new Date(store.createdAt).toLocaleDateString()}

            </p>

          </div>

        </div>

      );

    })}

  </div>

</div>
</div>

  );

}

function Card({

title,

value,

}:{

title:string;

value:string|number;

}){

return(

<div className="bg-zinc-900 rounded-2xl p-6">

<p className="text-zinc-400">

{title}

</p>

<h2 className="text-4xl font-bold mt-4">

{value}

</h2>

</div>

);

}