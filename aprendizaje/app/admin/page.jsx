"use client";
import { useState, useEffect } from "react";
import { Package, User, Clock, CheckCircle, Truck, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBadge from "../ui/StatusBadge";
import Modal from "../ui/Modal";
import AssignForm from "../ui/AssignForm";

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "";

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch(`/api/orders`);
      if (!response.ok) throw new Error("Error al obtener órdenes");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }


  function openAssignModal(order) {
    setSelectedOrder(order);
    setModalOpen(true);
  }

  async function handleAssign(repartidor, origenAddress) {
    console.log("handleAssign recibido:", { repartidor, origenAddress }); // Debug
    try {
      const response = await fetch(`/api/orders/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          repartidor,
          origenAddress,
        }),
      });

      if (!response.ok) throw new Error("Error al asignar orden");

      await fetchOrders();
      setModalOpen(false);
    } catch (error) {
      console.error("Error assigning order:", error);
    }
  }

  async function handleDelete(orderId) {
    const ok = window.confirm("¿Eliminar este pedido?");
    if (!ok) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Error al eliminar");
      await fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  }


  function handleLogout() {
  // EJEMPLO: limpiar datos de sesión
  localStorage.removeItem("token");

  // Redirigir al login (si usas Next.js router)
  window.location.href = "/login";
}

  // El badge de estado se obtiene desde `app/ui/StatusBadge` (reutilizable)

  const pendingCount = orders.filter(o => o.estado === "Pendiente").length;
  const inTransitCount = orders.filter(o => o.estado === "En camino").length;
  const deliveredCount = orders.filter(o => o.estado === "Entregado").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-gray-900 dark:text-white">
                Gestión de pedidos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Administra y asigna pedidos a repartidores
            </p>
          </div>

          {/* BOTÓN DE CERRAR SESIÓN */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/users")}
              className="px-4 py-2 rounded-xl text-sm font-medium 
                 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                 text-gray-800 dark:text-gray-100 shadow-sm hover:shadow transition-all"
            >
              Ver usuarios
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-medium 
                 bg-red-600 hover:bg-red-700 active:bg-red-800 
                 text-white shadow-sm hover:shadow transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Pendientes</p>
                <p className="text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">En camino</p>
                <p className="text-gray-900 dark:text-white">{inTransitCount}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Entregados</p>
                <p className="text-gray-900 dark:text-white">{deliveredCount}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-500 dark:text-gray-400">Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No hay pedidos disponibles</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order._id}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                           rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 
                           transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Cliente</p>
                          <p className="text-gray-900 dark:text-white">{order.cliente}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.estado} />
                        {order.repartidor && (
                          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            {order.repartidor}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.estado === "Pendiente" && (
                        <button
                          onClick={() => openAssignModal(order)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 
                                     bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                                     text-white rounded-xl shadow-sm hover:shadow 
                                     transition-all duration-200 group/btn"
                        >
                          <span>Asignar</span>
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                      {order.estado !== "Entregado" && (
                        <button
                          onClick={() => openAssignModal(order)}
                          className="inline-flex items-center justify-center px-4 py-2.5 
                                     bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                                     text-white rounded-xl shadow-sm hover:shadow 
                                     transition-all"
                        >
                          Editar origen
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="inline-flex items-center justify-center px-4 py-2.5 
                                   bg-red-600 hover:bg-red-700 active:bg-red-800
                                   text-white rounded-xl shadow-sm hover:shadow 
                                   transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Asignar pedido">
          {selectedOrder && (
            <AssignForm order={selectedOrder} onSubmit={handleAssign} />
          )}
        </Modal>
      </div>
    </div>
  );
}
