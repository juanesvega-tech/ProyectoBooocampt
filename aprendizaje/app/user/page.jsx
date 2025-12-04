"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, MapPin, User, AlertCircle, CheckCircle, LogOut } from "lucide-react";

// Coordenadas de referencia (Buenos Aires)
const LOCATIONS = {
  "C. Florida, CABA": { lat: -34.6037, lng: -58.3816 },
  "Av. Corrientes, CABA": { lat: -34.6090, lng: -58.3840 },
  "Lavalle, CABA": { lat: -34.6070, lng: -58.3820 },
  "Tucumán, CABA": { lat: -34.6100, lng: -58.3850 },
  "Alsina, CABA": { lat: -34.6045, lng: -58.3800 },
  "Pueyrredón, CABA": { lat: -34.6110, lng: -58.3865 },
};

export default function UserPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.replace("/login");
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!clientName.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    if (!lugarEntrega.trim()) {
      setError("Por favor ingresa el lugar de entrega");
      return;
    }

    setLoading(true);

    try {
      // Coordenadas de lugar de entrega
      const lugarCoords = LOCATIONS[lugarEntrega] || {
        lat: -34.6 + Math.random() * 0.1,
        lng: -58.38 + Math.random() * 0.1,
      };

      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: clientName,
          destinoAddress: lugarEntrega,
          destino: lugarCoords,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el pedido");
      }

      const newOrder = await response.json();

      setSuccess(`¡Pedido creado exitosamente! ID: ${newOrder._id}`);
      setClientName("");
      setLugarEntrega("");

      // Limpiar mensaje de éxito después de 4 segundos
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Error al crear el pedido: " + (err.message || "Intenta de nuevo"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Crear pedido
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Completa el formulario para crear un nuevo pedido de envío
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium 
               bg-red-600 hover:bg-red-700 active:bg-red-800 
               text-white shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  Tu nombre
                </div>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-all"
              />
            </div>

            {/* Lugar de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Lugar de entrega
                </div>
              </label>
              <input
                type="text"
                value={lugarEntrega}
                onChange={(e) => setLugarEntrega(e.target.value)}
                placeholder="Ej: Avenida Secundaria 456, CABA"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-all"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lugar donde se entrega el pedido
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 
                         disabled:bg-indigo-400 disabled:cursor-not-allowed
                         text-white font-medium rounded-lg shadow-sm hover:shadow 
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando pedido...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  Crear pedido
                </>
              )}
            </button>
          </form>
        </div>

        
      </div>
    </div>
  );
}
