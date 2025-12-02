"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔥 Nueva función: login real al backend
  async function loginToBackend(email, password) {
    const res = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Error al iniciar sesión");
    }

    return data; // { token, user }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa email y contraseña");
      return;
    }

    try {
      // 👇 Llamamos al backend real
      const { token, user } = await loginToBackend(email, password);

      // Guardamos la sesión en localStorage (igual que antes)
      localStorage.setItem(
        "auth",
        JSON.stringify({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          token: token,
        })
      );

      // Redirección según rol
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "repartidor") {
        router.replace("/dashboard");
      } else {
        // usuario normal (role === "user" o por defecto)
        router.replace("/user");
      }

    } catch (err) {
      setError(err.message);
    }
  }

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleRecuperarClick = () => {
    router.push("/recuperar");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Acceso visual
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Entrar
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setEmail("user@example.com");
                  setPassword("password123");
                  setError("");
                }}
                className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Usar credenciales de ejemplo
              </button>

              <button
                type="button"
                onClick={handleRecuperarClick}
                className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Recuperar
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            ¿No tienes cuenta? Crea una para gestionar tu perfil y acceder al
            dashboard.
          </p>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
