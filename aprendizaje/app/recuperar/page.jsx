// ...existing code...
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Introduce tu email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    // simulación visual de envío
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      // redirigir al login después de 3s
      setTimeout(() => router.replace("/login"), 3000);
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Formulario visual — sin envío real</p>
        </header>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 ${
                  loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
              >
                {loading ? "Enviando…" : "Enviar instrucciones"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Volver al login
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4">✓</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Instrucciones enviadas</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Si existe una cuenta con {email}, recibirás un email. Redirigiendo al login...
            </p>
            <button
              onClick={() => router.replace("/login")}
              className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Ir al login ahora
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
}
// ...existing code...
