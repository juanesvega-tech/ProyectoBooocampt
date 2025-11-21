"use client";
import { useState, useEffect } from "react";
import * as ordersAPI from "../api/orders";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Siempre hacemos una copia para React
    setOrders([...ordersAPI.getOrders()]);
  }, []);

  function handleAssign(orderId) {
    // Asigna pedido al repartidor
    ordersAPI.assignOrder(orderId, "repartidor1");
    // Actualizamos estado con copia nueva
    setOrders([...ordersAPI.getOrders()]);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Gestión de pedidos</h1>
      <div className="grid gap-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-md shadow flex justify-between items-center"
          >
            <div>
              <p>Cliente: {order.cliente}</p>
              <p>Estado: {order.estado}</p>
            </div>
            {order.estado === "Pendiente" && (
              <button
                onClick={() => handleAssign(order.id)}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Asignar a repartidor
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

