"use client";
import { useState, useEffect } from "react";
import * as ordersAPI from "../api/orders";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([...ordersAPI.getOrders()]);
  }, []);

  function handleAssign(orderId) {
    ordersAPI.assignOrder(orderId, "repartidor1");
    setOrders([...ordersAPI.getOrders()]);
  }

  function getStatusColor(status) {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "En camino":
        return "bg-blue-100 text-blue-700";
      case "Entregado":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Gestión de pedidos
        </h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-200
                         dark:border-gray-700 rounded-xl shadow-sm
                         hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cliente: {order.cliente}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.estado)}`}
                  >
                    {order.estado}
                  </span>
                </div>

                {order.estado === "Pendiente" && (
                  <button
                    onClick={() => handleAssign(order.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                               text-white rounded-lg shadow 
                               transition-all duration-200"
                  >
                    Asignar a repartidor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

