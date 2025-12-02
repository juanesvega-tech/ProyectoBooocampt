"use client";

import { useState } from "react";
import * as ordersAPI from "../api/orders";
import { Package, MapPin, User, AlertCircle, CheckCircle } from "lucide-react";

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
  const [clientName, setClientName] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!clientName.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    if (!originAddress.trim()) {
      setError("Por favor ingresa la dirección de origen");
      return;
    }

    if (!destAddress.trim()) {
      setError("Por favor ingresa la dirección de destino");
      return;
    }

    if (originAddress === destAddress) {
      setError("El origen y destino no pueden ser iguales");
      return;
    }

    setLoading(true);

    try {
      // Obtener coordenadas (usando las predefinidas o simulando con pequeña variación)
      const originCoords = LOCATIONS[originAddress] || {
        lat: -34.6 + Math.random() * 0.1,
        lng: -58.38 + Math.random() * 0.1,
      };

      const destCoords = LOCATIONS[destAddress] || {
        lat: -34.6 + Math.random() * 0.1,
        lng: -58.38 + Math.random() * 0.1,
      };

      const newOrder = ordersAPI.createOrder(
        clientName,
        originAddress,
        destAddress,
        originCoords,
        destCoords
      );

      setSuccess(`¡Pedido creado exitosamente! ID: ${newOrder.id}`);
      setClientName("");
      setOriginAddress("");
      setDestAddress("");

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
        <div className="mb-8">
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

            {/* Origen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Dirección de origen
                </div>
              </label>
              <select
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-all"
              >
                <option value="">-- Selecciona una ubicación --</option>
                {Object.keys(LOCATIONS).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                O ingresa una dirección personalizada
              </p>
              {originAddress && !LOCATIONS[originAddress] && (
                <input
                  type="text"
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  placeholder="Ej: Calle Principal 123, CABA"
                  className="w-full mt-2 px-4 py-3 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all"
                />
              )}
            </div>

            {/* Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Dirección de destino
                </div>
              </label>
              <select
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-all"
              >
                <option value="">-- Selecciona una ubicación --</option>
                {Object.keys(LOCATIONS).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                O ingresa una dirección personalizada
              </p>
              {destAddress && !LOCATIONS[destAddress] && (
                <input
                  type="text"
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  placeholder="Ej: Avenida Secundaria 456, CABA"
                  className="w-full mt-2 px-4 py-3 border border-gray-300 dark:border-gray-600 
                             rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all"
                />
              )}
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

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Consejo:</strong> Una vez que crees un pedido, aparecerá en el panel de administración donde será asignado a un repartidor.
          </p>
        </div>
      </div>
    </div>
  );
}
