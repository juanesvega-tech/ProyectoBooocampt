// ...existing code...
// ...existing code...
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setUser(parsed); // <-- AQUI AGREGUE EL COMENTARIO
    } catch {
      localStorage.removeItem("auth");
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("auth");
    router.replace("/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-500">Redirigiendo…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            {String(user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bienvenido, {user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Perfil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {user.id ?? "-"}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}