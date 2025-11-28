// ...existing code...
// ...existing code...
"use client";

import { useEffect, useState } from "react";
import MapRoute from "../components/MapRoute";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulamos fetch de la API
    import("../api/orders").then(mod => {
      const allOrders = mod.getOrders();
      setOrders(allOrders.filter(o => o.repartidor === "repartidor1"));
    });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>
      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
            <h2 className="font-semibold">{order.cliente}</h2>
            <p>Estado: {order.estado}</p>
            {order.origenAddress && <p>Origen: {order.origenAddress}</p>}
            {order.destinoAddress && <p>Destino: {order.destinoAddress}</p>}
            <MapRoute origen={order.origen} destino={order.destino} />
          </div>
        ))}
        {orders.length === 0 && <p>No tienes pedidos asignados.</p>}
      </div>
    </div>
  );
}
