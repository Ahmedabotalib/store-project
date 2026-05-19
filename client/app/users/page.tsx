import DashboardLayout from "@/layouts/DashboardLayout";

const users = [
  {
    id: 1,
    name: "Ahmed",
    email: "ahmed@test.com",
    role: "Admin",
    status: "Active",
  },

  {
    id: 2,
    name: "Mohamed",
    email: "mohamed@test.com",
    role: "Manager",
    status: "Active",
  },

  {
    id: 3,
    name: "Ali",
    email: "ali@test.com",
    role: "Cashier",
    status: "Inactive",
  },
];

export default function UsersPage() {

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <p className="text-zinc-400 mt-1">
            Manage system users
          </p>

        </div>

        <button className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition">
          Add User
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">

        <table className="w-full">

          <thead className="bg-black">

            <tr>

              <th className="text-left p-5">
                Name
              </th>

              <th className="text-left p-5">
                Email
              </th>

              <th className="text-left p-5">
                Role
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-left p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
              >

                <td className="p-5">
                  {user.name}
                </td>

                <td className="p-5 text-zinc-400">
                  {user.email}
                </td>

                <td className="p-5">
                  {user.role}
                </td>

                <td className="p-5">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>

                </td>

                <td className="p-5">

                  <div className="flex gap-3">

                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">
                      Edit
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-red-500 text-white">
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );
}