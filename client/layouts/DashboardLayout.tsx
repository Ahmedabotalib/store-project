import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}

      <aside className="w-64 bg-black border-r border-zinc-800 p-6">

        <h1 className="text-2xl font-bold mb-10">
          بدلتك
        </h1>

        <nav className="space-y-4">

          <Link
            href="/dashboard"
            className="block p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/users"
            className="block p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Users
          </Link>

          <Link
            href="/products"
            className="block p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Products
          </Link>

          <Link
            href="/rentals"
            className="block p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            Rentals
          </Link>

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
              Welcome back admin
            </p>
          </div>

          <button className="bg-white text-black px-5 py-2 rounded-xl font-semibold">
            Logout
          </button>

        </div>

        {/* PAGE CONTENT */}

        {children}

      </main>

    </div>

  );
}