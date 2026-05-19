import DashboardLayout from "@/layouts/DashboardLayout";

export default function DashboardPage() {
  return (

    <DashboardLayout>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Revenue
          </h3>

          <p className="text-3xl font-bold">
            25,000 EGP
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Rentals
          </h3>

          <p className="text-3xl font-bold">
            120
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Customers
          </h3>

          <p className="text-3xl font-bold">
            340
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Products
          </h3>

          <p className="text-3xl font-bold">
            85
          </p>
        </div>

      </div>

    </DashboardLayout>

  );
}