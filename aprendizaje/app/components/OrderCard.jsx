export default function OrderCard({ order, onAssign, isAdminView = false }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{order.cliente}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Estado: {order.estado}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">ID Pedido: {order.id}</p>
      </div>

      {isAdminView && order.estado === "Pendiente" && (
        <button
          onClick={() => onAssign(order.id)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Asignar a repartidor
        </button>
      )}
    </div>
  );
}
