"use client";

import { useEffect, useState } from "react";
import MapRoute from "../components/MapRoute";
import { LogOut, Truck, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBadge from "../ui/StatusBadge";

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repartidorName, setRepartidorName] = useState("");

  useEffect(() => {
    fetchOrders();
    // Obtener nombre del repartidor desde localStorage
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    setRepartidorName(auth.name || "");
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:4000/api/orders");
      if (!response.ok) throw new Error("Error al obtener órdenes");
      const data = await response.json();
      
      // Filtrar órdenes asignadas al repartidor actual
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      console.log("Auth:", auth); // Debug
      console.log("Todas las órdenes:", data); // Debug
      
      const filtered = data.filter(o => {
        console.log(`Comparando: "${o.repartidor}" === "${auth.name}"`); // Debug
        return o.repartidor === auth.name;
      });
      
      console.log("Órdenes filtradas:", filtered); // Debug
      setOrders(filtered);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-600 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mis pedidos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Pedidos asignados para entrega
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

        {/* Orders Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Truck className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-500 dark:text-gray-400">Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Truck className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tienes pedidos asignados.</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.cliente}
                    </h2>
                    <StatusBadge status={order.estado} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tu ubicación (Origen)</p>
                        <p className="text-gray-900 dark:text-white">{order.origenAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lugar de entrega (Destino)</p>
                        <p className="text-gray-900 dark:text-white">{order.destinoAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mapa con ruta */}
                {order.origen && order.destino && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="h-80">
                      <MapRoute origen={order.origen} destino={order.destino} />
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        📍 Verde: Tu ubicación | 📍 Rojo: Lugar de entrega
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
