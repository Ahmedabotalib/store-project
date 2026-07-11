"use client";
import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
export default function UsersPage() {
const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [authorized, setAuthorized] =
  useState(false);
  const [loading, setLoading] = useState(true);
  const deleteUser = async (id: number) => {

  const confirmDelete =
    confirm("Delete this user?");

  if (!confirmDelete) return;

  try {

    await api.delete(`/users/${id}`);

    setUsers(
      users.filter(
        (user) => user.id !== id
      )
    );

  } catch (error) {

    console.log(error);

    alert("Failed To Delete User");

  }

};
const fetchUsers = async () => {

  try {

    const response =
      await api.get("/users");

    setUsers(response.data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};

useEffect(() => {
  const role =
  localStorage.getItem("role");

if (role !== "Admin") {

  router.push("/dashboard");

  return;

}

setAuthorized(true);

  fetchUsers();

}, []);
if (loading) {
if (!authorized) {

  return null;

}
  return (

    <DashboardLayout>

      <p>Loading Users...</p>

    </DashboardLayout>

  );

}


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

        <Link
  href="/users/add"
  className="bg-white text-black px-5 py-3 rounded-xl font-semibold"
>
  Add User
</Link>

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

            {users.map((user: any) => (

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

                    <Link
  href={`/users/edit/${user.id}`}
  className="px-4 py-2 rounded-lg bg-blue-500 text-white"
>
  Edit
</Link>

                    <button
  onClick={() =>
    deleteUser(user.id)
  }
  className="px-4 py-2 rounded-lg bg-red-500 text-white"
>
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