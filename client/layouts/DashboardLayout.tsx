import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [storeName, setStoreName] = useState("");
const [user, setUser] = useState<any>(null);

const isSuperAdmin = role === "SuperAdmin";
useEffect(() => {

  const user = localStorage.getItem("user");

  if (user) {

    const parsedUser = JSON.parse(user);
    setUser(parsedUser);

    setRole(parsedUser.role);

    setStoreName(parsedUser.store?.name || "بدلتك");

  }

}, []);
const handleLogout = () => {

localStorage.removeItem("token");

localStorage.removeItem("role");

router.push("/login");

};
  return (

    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}

      <aside className="w-64 bg-black border-r border-zinc-800 p-6">

        <h1 className="text-2xl font-bold mb-10">
  {storeName}
</h1>

     <nav className="space-y-4">

{isSuperAdmin ? (

<>

<Link
href="/super-admin"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Dashboard
</Link>

<Link
  href="/super-admin/stores"
  className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
  Stores
</Link>

</>

) : (

<>

<Link
href="/dashboard"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Dashboard
</Link>

{role === "Admin" && (

<Link
href="/users"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Users
</Link>

)}

<Link
href="/products"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Products
</Link>

<Link
href="/customers"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Customers
</Link>

<Link
href="/rentals"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Rentals
</Link>

<Link
href="/sales"
className="block p-3 rounded-xl hover:bg-zinc-800 transition"
>
Sales
</Link>

</>

)}

</nav>

      </aside>

      {/* CONTENT */}

      <main className="flex-1 p-8">

        {/* TOPBAR */}

        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>

            <p className="text-zinc-400">
  Welcome back {user?.name}
</p>

<p className="text-sm text-zinc-500">
  {user?.role} • {storeName}
</p>
          </div>

          <button

onClick={handleLogout}

className="bg-white text-black px-5 py-2 rounded-xl font-semibold"

>

Logout

</button>

        </div>

        {/* PAGE CONTENT */}

        {children}

      </main>

    </div>

  );
}